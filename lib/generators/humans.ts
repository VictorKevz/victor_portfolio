import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export function generateHumansTxt(locale: Locale): string {
  const authorName = getTranslation(locale, "author.name");
  const authorRole = getTranslation(locale, "author.role");
  const orgName = getTranslation(locale, "organization.name");
  const orgDescription = getTranslation(locale, "organization.description");

  const content = `/* TEAM */
Founder: ${typeof authorName === "string" ? authorName : siteConfig.author.name}
${typeof authorRole === "string" && authorRole ? `Role: ${authorRole}` : "Role: N/A"}
Contact: ${siteConfig.author.email || "N/A"}
Website: ${siteConfig.author.website || "N/A"}

/* ORGANIZATION */
Name: ${typeof orgName === "string" ? orgName : siteConfig.organization.name}
${typeof orgDescription === "string" && orgDescription ? `Description: ${orgDescription}` : "Description: N/A"}
Website: ${siteConfig.organization.website}

/* SITE */
Standards: HTML5, CSS3, JavaScript (ES6+)
Components: Next.js, React, TypeScript, Tailwind CSS
Software: Next.js (latest)
`;

  return content;
}
