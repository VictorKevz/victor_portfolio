import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export function generateAuthorSchema(locale: Locale): object {
  const baseUrl = siteConfig.site.url;
  const imageUrl = siteConfig.organization.logo
    ? `${baseUrl}${siteConfig.organization.logo}`
    : undefined;
  const name = getTranslation(locale, "author.name");
  const role = getTranslation(locale, "author.role");
  const bio = getTranslation(locale, "author.bio");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: typeof name === "string" ? name : siteConfig.author.name,
    ...(typeof role === "string" && role ? { jobTitle: role } : {}),
    ...(typeof bio === "string" && bio ? { description: bio } : {}),
    email: siteConfig.author.email,
    url: siteConfig.author.website,
    ...(imageUrl ? { image: imageUrl } : {}),
    sameAs: siteConfig.author.website ? [siteConfig.author.website] : [],
  };
}

