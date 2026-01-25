import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand revalidation endpoint.
 *
 * Query parameters:
 * - secret: Required. Must match REVALIDATION_SECRET environment variable
 * - path: Optional. Page path to revalidate (e.g., '/fi', '/en')
 * - tag: Optional. Cache tag to revalidate (e.g., 'homepage')
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path");
    const tag = searchParams.get("tag");

    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid secret token" },
        { status: 401 }
      );
    }

    if (!path && !tag) {
      return NextResponse.json(
        { error: "Either path or tag parameter is required" },
        { status: 400 }
      );
    }

    if (path && !path.startsWith("/")) {
      return NextResponse.json(
        { error: "Path must start with /" },
        { status: 400 }
      );
    }

    const revalidatedPaths: string[] = [];

    if (tag) {
      revalidateTag(tag, "max");
    }

    if (path) {
      revalidatePath(path, "layout");
      revalidatedPaths.push(path);
    }
    
    return NextResponse.json({
      revalidated: true,
      tag: tag ?? null,
      paths: revalidatedPaths.length ? revalidatedPaths : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}

/**
 * GET /api/revalidate
 *
 * Health check endpoint to verify the revalidation route is accessible.
 * Does not perform revalidation (use POST for that).
 */
export async function GET() {
  return NextResponse.json({
    message: "Revalidation endpoint is active",
    method: "Use POST with secret and path parameters to revalidate",
  });
}

