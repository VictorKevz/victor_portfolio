import { siteConfig } from "@/config/site.config";

export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    description: siteConfig.organization.description,
    url: siteConfig.organization.website,
    logo: siteConfig.organization.logo
      ? {
          "@type": "ImageObject",
          url: `${siteConfig.site.url}${siteConfig.organization.logo}`,
        }
      : undefined,
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

