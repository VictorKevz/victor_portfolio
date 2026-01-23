import { NextRequest, NextResponse } from "next/server";

interface FounderRequest {
  email: string;
  locale?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FounderRequest = await request.json();
    const { email, locale } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoApiUrl = process.env.BREVO_API_URL || "https://api.brevo.com/v3";

    if (!brevoApiKey) {
      console.error("BREVO_API_KEY environment variable is not set");
      return NextResponse.json(
        { success: false, message: "Service temporarily unavailable" },
        { status: 500 }
      );
    }

    const language = locale === "fi" || locale === "en" ? locale.toUpperCase() : "EN";
    const updatePayload = {
      attributes: {
        CLUB_HELIOS_FOUNDER: true,
        LANGUAGE: language,
      },
    };

    const response = await fetch(
      `${brevoApiUrl}/contacts/${encodeURIComponent(email.toLowerCase())}`,
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

    if (response.ok || response.status === 204) {
      return NextResponse.json({
        success: true,
        message: "Successfully joined Club Helios founders list",
      });
    }

    if (response.status === 404) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not found. Please sign up on the main page first.",
        },
        { status: 404 }
      );
    }

    const errorData = await response.json().catch(() => ({}));
    console.error("Brevo API error:", errorData);

    return NextResponse.json(
      { success: false, message: "Failed to update. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Founder API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

