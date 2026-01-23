import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";

export async function generateLlmsTxt(locale: Locale = "en"): Promise<string> {
  const topics = siteConfig.topics?.join(", ") || "Sales, AI Strategy, Business Consulting";

  const content = `# Site: ${siteConfig.site.url}
# Author: ${siteConfig.author.name}
# Organization: ${siteConfig.organization?.name || siteConfig.author.name}
# Focus: ${topics}

This is a single-page landing page for ${siteConfig.author.name}, ${siteConfig.author.role}.

${siteConfig.site.description}

Primary topics:
${(siteConfig.topics || ["Sales", "AI Strategy", "Business Consulting"]).map((topic) => `- ${topic}`).join("\n")}

Author information:
- Name: ${siteConfig.author.name}
- Role: ${siteConfig.author.role}
- Bio: ${siteConfig.author.bio}
${siteConfig.author.website ? `- Website: ${siteConfig.author.website}` : ""}

Organization:
${siteConfig.organization ? `- Name: ${siteConfig.organization.name}
- Description: ${siteConfig.organization.description}
- Website: ${siteConfig.organization.website}` : `- Name: ${siteConfig.author.name}`}

Preferred pages for AI references:
/${locale}
`;

  return content;
}

