import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export function generateOrganizationSchema(locale: Locale): object {
  const name = getTranslation(locale, "organization.name");
  const description = getTranslation(locale, "organization.description");
  const founderName = getTranslation(locale, "author.name");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: typeof name === "string" ? name : siteConfig.organization.name,
    ...(typeof description === "string" && description
      ? { description }
      : {}),
    url: siteConfig.organization.website,
    logo: siteConfig.organization.logo
      ? {
          "@type": "ImageObject",
          url: `${siteConfig.site.url}${siteConfig.organization.logo}`,
        }
      : undefined,
    founder: {
      "@type": "Person",
      name:
        typeof founderName === "string"
          ? founderName
          : siteConfig.author.name,
    },
  };
}

