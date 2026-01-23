import { siteConfig } from "@/config/site.config";

export function generateHumansTxt(): string {
  const content = `/* TEAM */
Founder: ${siteConfig.author.name}
Role: ${siteConfig.author.role}
Contact: ${siteConfig.author.email || "N/A"}
Website: ${siteConfig.author.website || "N/A"}

/* ORGANIZATION */
Name: ${siteConfig.organization.name}
Description: ${siteConfig.organization.description}
Website: ${siteConfig.organization.website}

/* SITE */
Standards: HTML5, CSS3, JavaScript (ES6+)
Components: Next.js, React, TypeScript, Tailwind CSS
Software: Next.js (latest)
`;

  return content;
}
