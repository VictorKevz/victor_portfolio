import { siteConfig } from "@/config/site.config";

export function generateRobotsTxt(): string {
  const content = `# robots.txt
# Allow all AI crawlers and search engines

User-agent: *
Allow: /

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemap
Sitemap: ${siteConfig.site.url}/sitemap.xml
`;

  return content;
}

