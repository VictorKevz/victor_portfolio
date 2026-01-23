import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
  locale?: string;
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
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

  if (data.message && typeof data.message !== "string") {
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

  if (data.message && data.message.length > 5000) {
    errors.push("Message is too long (max 5000 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function submitToBrevo(
  formData: ContactFormData,
  token: string
): Promise<{ success: boolean; updated?: boolean; errorCode?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";
  const brevoListId = process.env.BREVO_LIST_ID
    ? parseInt(process.env.BREVO_LIST_ID, 10)
    : undefined;

  if (!brevoApiKey) {
    console.error("BREVO_API_KEY environment variable is not set");
    return {
      success: false,
      errorCode: "CONFIG_ERROR",
    };
  }

  try {
    const submissionToken = token;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const language =
      formData.locale === "fi" || formData.locale === "en"
        ? formData.locale
        : "en";
    const authenticatedUrl = `${siteUrl}/mini-course?ref=${submissionToken}&lang=${language}`;

    const brevoPayload = {
      email: formData.email,
      attributes: {
        FIRSTNAME: formData.firstName,
        LASTNAME: formData.lastName,
        MESSAGE: formData.message || "",
        SUBMISSION_TOKEN: submissionToken,
        AUTHENTICATED_URL: authenticatedUrl,
        LANGUAGE: language.toUpperCase(),
        SUBMITTED_AT: new Date().toISOString(),
      },
      ...(brevoListId ? { listIds: [brevoListId] } : {}),
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
          ...(brevoListId
            ? { listIds: [parseInt(process.env.BREVO_LIST_ID!, 10)] }
            : {}),
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
    const body = await request.json();
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

    const token = generateToken();
    const brevoResult = await submitToBrevo(formData, token);

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
