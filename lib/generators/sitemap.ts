import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export async function generateSitemap(): Promise<string> {
  const urls: SitemapUrl[] = [];
  const locales = siteConfig.site.locales as Locale[];

  for (const locale of locales) {
    urls.push({
      loc: `${siteConfig.site.url}/${locale}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
      alternates: locales.map((loc) => ({
        hreflang: loc,
        href: `${siteConfig.site.url}/${loc}`,
      })),
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  for (const url of urls) {
    xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

    if (url.alternates) {
      for (const alt of url.alternates) {
        xml += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
      }
    }

    xml += `
  </url>
`;
  }

  xml += `</urlset>`;

  return xml;
}

