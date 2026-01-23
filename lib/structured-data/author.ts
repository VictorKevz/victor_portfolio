import { siteConfig } from "@/config/site.config";

export function generateAuthorSchema(): object {
  const baseUrl = siteConfig.site.url;
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    jobTitle: siteConfig.author.role,
    description: siteConfig.author.bio,
    email: siteConfig.author.email,
    url: siteConfig.author.website,
    image: `${baseUrl}/markkutauriainen_1434386354_18.webp`,
    sameAs: siteConfig.author.website ? [siteConfig.author.website] : [],
  };
}

