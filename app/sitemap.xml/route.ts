import { generateSitemap } from "@/lib/generators/sitemap";

export const revalidate = 3600;

export async function GET() {
  const sitemap = await generateSitemap();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
