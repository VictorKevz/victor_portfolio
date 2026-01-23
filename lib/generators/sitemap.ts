import { siteConfig } from "@/config/site.config";
import { getBlogPillars, getBlogPostsForSitemap } from "@/lib/wordpress/blog";
import type { BlogPost, PillarPost } from "@/lib/wordpress/types";
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

  const pillarByLocale = new Map<Locale, PillarPost[]>();
  const postByLocale = new Map<Locale, BlogPost[]>();

  for (const locale of locales) {
    const [pillars, posts] = await Promise.all([
      getBlogPillars(locale),
      getBlogPostsForSitemap(locale),
    ]);
    pillarByLocale.set(locale, pillars);
    postByLocale.set(locale, posts);
  }

  const pillarIdToSlugByLocale = new Map<Locale, Map<number, string>>();
  const postIdToSlugByLocale = new Map<Locale, Map<number, string>>();

  locales.forEach((locale) => {
    const pillarMap = new Map<number, string>();
    (pillarByLocale.get(locale) || []).forEach((pillar) => {
      pillarMap.set(pillar.id, pillar.slug);
    });
    pillarIdToSlugByLocale.set(locale, pillarMap);

    const postMap = new Map<number, string>();
    (postByLocale.get(locale) || []).forEach((post) => {
      postMap.set(post.id, post.slug);
    });
    postIdToSlugByLocale.set(locale, postMap);
  });

  const getPillarAlternateSlug = (
    locale: Locale,
    pillar: PillarPost,
    targetLocale: Locale
  ): string | null => {
    if (locale === targetLocale) {
      return pillar.slug;
    }
    const translation = pillar.acf?.pillar_data?.translation_pillar;
    if (translation && typeof translation === "object") {
      if (translation.post_name) {
        return translation.post_name;
      }
      if (typeof translation.ID === "number") {
        return pillarIdToSlugByLocale.get(targetLocale)?.get(translation.ID) || null;
      }
    }
    return null;
  };

  const getPostAlternateSlug = (
    locale: Locale,
    post: BlogPost,
    targetLocale: Locale
  ): string | null => {
    if (locale === targetLocale) {
      return post.slug;
    }
    const translation = post.acf?.blog_post?.header?.translation_post;
    if (translation && typeof translation === "object") {
      if (translation.post_name) {
        return translation.post_name;
      }
      if (typeof translation.ID === "number") {
        return postIdToSlugByLocale.get(targetLocale)?.get(translation.ID) || null;
      }
    }
    return null;
  };

  for (const locale of locales) {
    const baseLocaleUrl = `${siteConfig.site.url}/${locale}`;
    urls.push({
      loc: `${baseLocaleUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.8,
      alternates: locales.map((loc) => ({
        hreflang: loc,
        href: `${siteConfig.site.url}/${loc}/blog`,
      })),
    });

    const pillars = pillarByLocale.get(locale) || [];
    const posts = postByLocale.get(locale) || [];

    const pillarMap = new Map<number, PillarPost>(pillars.map((pillar) => [pillar.id, pillar]));

    pillars.forEach((pillar) => {
      const alternates = locales
        .map((loc) => {
          const slug = getPillarAlternateSlug(locale, pillar, loc);
          if (!slug) return null;
          return {
            hreflang: loc,
            href: `${siteConfig.site.url}/${loc}/blog/${slug}`,
          };
        })
        .filter(Boolean) as SitemapUrl["alternates"];

      urls.push({
        loc: `${baseLocaleUrl}/blog/${pillar.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
        alternates,
      });
    });

    posts.forEach((post) => {
      const parent = post.acf?.blog_post?.header?.parent_pillar;
      const pillarId =
        typeof parent === "number"
          ? parent
          : typeof parent === "object" && typeof parent.ID === "number"
            ? parent.ID
            : null;
      const pillar = pillarId ? pillarMap.get(pillarId) : null;
      if (!pillar) {
        return;
      }
      const alternates = locales
        .map((loc) => {
          const postSlug = getPostAlternateSlug(locale, post, loc);
          const pillarSlug = getPillarAlternateSlug(locale, pillar, loc);
          if (!postSlug || !pillarSlug) return null;
          return {
            hreflang: loc,
            href: `${siteConfig.site.url}/${loc}/blog/${pillarSlug}/${postSlug}`,
          };
        })
        .filter(Boolean) as SitemapUrl["alternates"];

      urls.push({
        loc: `${baseLocaleUrl}/blog/${pillar.slug}/${post.slug}`,
        lastmod: post.modified || new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.6,
        alternates,
      });
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

