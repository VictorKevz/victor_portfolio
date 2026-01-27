import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  message: string;
  locale?: string;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return false;
}

function sanitizeText(
  input: unknown,
  { maxLen, preserveNewlines }: { maxLen: number; preserveNewlines: boolean }
): string {
  if (typeof input !== "string") return "";

  const normalized = input.normalize("NFC");
  const withoutControls = preserveNewlines
    ? normalized.replace(
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
        ""
      )
    : normalized.replace(
        // eslint-disable-next-line no-control-regex
        /[\u0000-\u001F\u007F]/g,
        ""
      );

  const collapsed = preserveNewlines
    ? withoutControls
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : withoutControls.replace(/\s+/g, " ").trim();

  return collapsed.slice(0, maxLen);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateFormData(data: ContactFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.firstName ||
    typeof data.firstName !== "string" ||
    data.firstName.trim().length === 0
  ) {
    errors.push("First name is required");
  } else if (data.firstName.trim().length < 2) {
    errors.push("First name is too short (min 2 characters)");
  }

  if (
    !data.lastName ||
    typeof data.lastName !== "string" ||
    data.lastName.trim().length === 0
  ) {
    errors.push("Last name is required");
  } else if (data.lastName.trim().length < 2) {
    errors.push("Last name is too short (min 2 characters)");
  }

  if (
    !data.email ||
    typeof data.email !== "string" ||
    data.email.trim().length === 0
  ) {
    errors.push("Email is required");
  } else if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (typeof data.message !== "string") {
    errors.push("Message must be a string");
  }

  if (data.firstName && data.firstName.length > 100) {
    errors.push("First name is too long (max 100 characters)");
  }

  if (data.lastName && data.lastName.length > 100) {
    errors.push("Last name is too long (max 100 characters)");
  }

  if (data.email && data.email.length > 254) {
    errors.push("Email is too long (max 254 characters)");
  }

  if (
    !data.service ||
    typeof data.service !== "string" ||
    data.service.trim().length === 0
  ) {
    errors.push("Service is required");
  }

  if (data.service && data.service.length > 120) {
    errors.push("Service is too long (max 120 characters)");
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.push("Message is required");
  } else if (data.message.length > 5000) {
    errors.push("Message is too long (max 5000 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function submitToBrevo(
  formData: ContactFormData
): Promise<{ success: boolean; updated?: boolean; errorCode?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";
  const brevoListIdRaw =
    process.env.BREVO_LIST_ID || process.env.BREVO_PROJECT_ID;
  const brevoListId = brevoListIdRaw
    ? Number.parseInt(brevoListIdRaw, 10)
    : undefined;
  const brevoListIdSafe =
    typeof brevoListId === "number" && Number.isFinite(brevoListId)
      ? brevoListId
      : undefined;

  if (!brevoApiKey) {
    console.error("BREVO_API_KEY environment variable is not set");
    return {
      success: false,
      errorCode: "CONFIG_ERROR",
    };
  }

  try {
    const language =
      formData.locale === "fi" || formData.locale === "en"
        ? formData.locale
        : "en";

    const brevoPayload = {
      email: formData.email,
      attributes: {
        FIRSTNAME: formData.firstName,
        LASTNAME: formData.lastName,
        SERVICE: formData.service,
        MESSAGE: formData.message || "",
        LANGUAGE: language.toUpperCase(),
        SUBMITTED_AT: new Date().toISOString(),
      },
      ...(brevoListIdSafe ? { listIds: [brevoListIdSafe] } : {}),
      updateEnabled: true,
    };

    const response = await fetch(`${brevoApiUrl}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(brevoPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({} as any));

      if (response.status === 409) {
        const updatePayload = {
          attributes: brevoPayload.attributes,
          ...(brevoListIdSafe ? { listIds: [brevoListIdSafe] } : {}),
        };

        const updateResponse = await fetch(
          `${brevoApiUrl}/contacts/${encodeURIComponent(formData.email)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              "api-key": brevoApiKey,
            },
            body: JSON.stringify(updatePayload),
          }
        );

        if (updateResponse.ok) {
          return { success: true, updated: true };
        }

        const updateError = await updateResponse
          .json()
          .catch(() => ({} as any));
        console.error("Brevo update contact error:", updateError);
        return {
          success: false,
          errorCode: "UPDATE_FAILED",
        };
      }

      console.error("Brevo API error:", errorData);
      return {
        success: false,
        errorCode: "BREVO_ERROR",
      };
    }

    return { success: true, updated: false };
  } catch (error) {
    console.error("Error submitting to Brevo:", error);
    return {
      success: false,
      errorCode: "NETWORK_ERROR",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, errorCode: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    const body = await request.json();
    if (typeof body?.company === "string" && body.company.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Form submitted successfully" },
        { status: 200 }
      );
    }

    const formData: ContactFormData = {
      firstName: sanitizeText(body.firstName, {
        maxLen: 100,
        preserveNewlines: false,
      }),
      lastName: sanitizeText(body.lastName, {
        maxLen: 100,
        preserveNewlines: false,
      }),
      email: sanitizeText(body.email, {
        maxLen: 254,
        preserveNewlines: false,
      }).toLowerCase(),
      service: sanitizeText(body.service, {
        maxLen: 120,
        preserveNewlines: false,
      }),
      message: sanitizeText(body.message, {
        maxLen: 5000,
        preserveNewlines: true,
      }),
      locale: body.locale === "fi" || body.locale === "en" ? body.locale : "en",
    };

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errorCode: "VALIDATION_ERROR",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const brevoResult = await submitToBrevo(formData);

    if (!brevoResult.success) {
      return NextResponse.json(
        {
          success: false,
          errorCode: brevoResult.errorCode || "UNKNOWN_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        updated: brevoResult.updated || false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
