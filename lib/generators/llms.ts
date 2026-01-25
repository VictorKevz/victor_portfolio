import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

export async function generateLlmsTxt(locale: Locale = "en"): Promise<string> {
  const topicValue = getTranslation(locale, "topics");
  const topics = Array.isArray(topicValue)
    ? topicValue.join(", ")
    : siteConfig.topics?.join(", ");
  const authorName = getTranslation(locale, "author.name");
  const authorRole = getTranslation(locale, "author.role");
  const authorBio = getTranslation(locale, "author.bio");
  const orgName = getTranslation(locale, "organization.name");
  const orgDescription = getTranslation(locale, "organization.description");

  const content = `# Site: ${siteConfig.site.url}
# Author: ${typeof authorName === "string" ? authorName : siteConfig.author.name}
# Organization: ${typeof orgName === "string" ? orgName : siteConfig.organization?.name || siteConfig.author.name}
# Focus: ${topics || ""}

This is a single-page portfolio for ${typeof authorName === "string" ? authorName : siteConfig.author.name}${typeof authorRole === "string" && authorRole ? `, ${authorRole}` : ""}.

${typeof authorBio === "string" ? authorBio : ""}

Primary topics:
${(Array.isArray(topicValue) ? topicValue : siteConfig.topics || []).map((topic) => `- ${topic}`).join("\n")}

Author information:
- Name: ${typeof authorName === "string" ? authorName : siteConfig.author.name}
${typeof authorRole === "string" && authorRole ? `- Role: ${authorRole}` : ""}
${typeof authorBio === "string" && authorBio ? `- Bio: ${authorBio}` : ""}
${siteConfig.author.website ? `- Website: ${siteConfig.author.website}` : ""}

Organization:
${siteConfig.organization ? `- Name: ${typeof orgName === "string" ? orgName : siteConfig.organization.name}
${typeof orgDescription === "string" && orgDescription ? `- Description: ${orgDescription}` : ""}
- Website: ${siteConfig.organization.website}` : `- Name: ${typeof authorName === "string" ? authorName : siteConfig.author.name}`}

Preferred pages for AI references:
/${locale}
`;

  return content;
}

