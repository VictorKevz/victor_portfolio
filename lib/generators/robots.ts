import { siteConfig } from "@/config/site.config";

export function generateRobotsTxt(): string {
  const content = `# robots.txt
# Allow all AI crawlers and search engines

User-agent: *
Allow: /
Disallow: /mini-course

# AI Crawlers
User-agent: GPTBot
Allow: /
Disallow: /mini-course

User-agent: ChatGPT-User
Allow: /
Disallow: /mini-course

User-agent: CCBot
Allow: /
Disallow: /mini-course

User-agent: anthropic-ai
Allow: /
Disallow: /mini-course

User-agent: Claude-Web
Allow: /
Disallow: /mini-course

User-agent: PerplexityBot
Allow: /
Disallow: /mini-course

# Sitemap
Sitemap: ${siteConfig.site.url}/sitemap.xml
`;

  return content;
}

