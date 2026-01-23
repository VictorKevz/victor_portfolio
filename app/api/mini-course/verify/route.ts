import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const TOKEN_EXPIRY_DAYS = 7;

interface BrevoContact {
  email: string;
  attributes: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    SUBMISSION_TOKEN?: string;
    SUBMITTED_AT?: string;
  };
}

function isTokenExpired(submittedAt: string | undefined): boolean {
  if (!submittedAt) return true;
  const submitted = new Date(submittedAt);
  const now = new Date();
  const diffMs = now.getTime() - submitted.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > TOKEN_EXPIRY_DAYS;
}

function signValue(value: string): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error("COOKIE_SECRET is not configured");
  }
  const signature = crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("hex");
  return `${value}.${signature}`;
}

function verifySignedValue(signedValue: string): string | null {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) return null;

  const lastDotIndex = signedValue.lastIndexOf(".");
  if (lastDotIndex === -1) return null;

  const value = signedValue.substring(0, lastDotIndex);
  const signature = signedValue.substring(lastDotIndex + 1);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("hex");

  if (signature !== expectedSignature) return null;
  return value;
}

async function findContactByToken(token: string): Promise<BrevoContact | null> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";
  const brevoListId = process.env.BREVO_LIST_ID;

  if (!brevoApiKey || !brevoListId) {
    return null;
  }

  try {
    const response = await fetch(
      `${brevoApiUrl}/contacts/lists/${brevoListId}/contacts?limit=500&offset=0`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.contacts && data.contacts.length > 0) {
      const matchingContact = data.contacts.find(
        (contact: BrevoContact) =>
          contact.attributes?.SUBMISSION_TOKEN === token
      );

      if (matchingContact) {
        return matchingContact as BrevoContact;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function findContactByEmail(email: string): Promise<BrevoContact | null> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";

  if (!brevoApiKey) return null;

  try {
    const response = await fetch(
      `${brevoApiUrl}/contacts/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
        },
      }
    );

    if (!response.ok) return null;

    const contact = await response.json();
    return contact as BrevoContact;
  } catch {
    return null;
  }
}

async function invalidateToken(email: string): Promise<void> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";

  if (!brevoApiKey) return;

  try {
    await fetch(`${brevoApiUrl}/contacts/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        attributes: {
          SUBMISSION_TOKEN: "",
          TOKEN_USED_AT: new Date().toISOString(),
        },
      }),
    });
  } catch {
    // Non-critical operation
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("ref");
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("mini_course_auth");

  if (existingCookie) {
    const email = verifySignedValue(existingCookie.value);
    if (email) {
      const contact = await findContactByEmail(email);
      if (contact) {
        return NextResponse.json({
          success: true,
          authenticated: true,
          user: {
            firstName: contact.attributes?.FIRSTNAME || "",
            lastName: contact.attributes?.LASTNAME || "",
            email: contact.email,
          },
        });
      }
    }
  }

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "MISSING_TOKEN",
        message: "Access token is required",
      },
      { status: 401 }
    );
  }

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_TOKEN",
        message: "Invalid access token format",
      },
      { status: 401 }
    );
  }

  const contact = await findContactByToken(token);

  if (!contact) {
    return NextResponse.json(
      {
        success: false,
        error: "TOKEN_NOT_FOUND",
        message: "Access token not found",
      },
      { status: 401 }
    );
  }

  if (isTokenExpired(contact.attributes.SUBMITTED_AT)) {
    return NextResponse.json(
      {
        success: false,
        error: "TOKEN_EXPIRED",
        message: "Link expired. Please request a new one.",
      },
      { status: 401 }
    );
  }

  const signedEmail = signValue(contact.email);

  const response = NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      firstName: contact.attributes.FIRSTNAME || "",
      lastName: contact.attributes.LASTNAME || "",
      email: contact.email,
    },
  });

  response.cookies.set("mini_course_auth", signedEmail, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  invalidateToken(contact.email);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  response.cookies.set("mini_course_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
