export interface SiteConfig {
  author: {
    firstName: string;
    lastName: string;
    name: string;
    bio: string;
    role: string;
    email?: string;
    website?: string;
  };
  organization: {
    name: string;
    description: string;
    website: string;
    logo?: string;
  };
  site: {
    name: string;
    description: string;
    url: string;
    defaultLocale: "en" | "fi";
    locales: ("en" | "fi")[];
  };
  topics: string[];
  hubPages: {
    sales: {
      title: string;
      description: string;
      slug: string;
    };
    ai: {
      title: string;
      description: string;
      slug: string;
    };
    entrepreneurship: {
      title: string;
      description: string;
      slug: string;
    };
    "beauty-wellness"?: {
      title: string;
      description: string;
      slug: string;
    };
  };
  contentSource: "static" | "wordpress";
}

export const siteConfig: SiteConfig = {
  author: {
    firstName: "Markku",
    lastName: "Tauriainen",
    name: "Markku Tauriainen",
    bio: "Sales professional with 50 years of experience, now integrating AI strategies for modern business.",
    role: "Founder / Sales & AI Strategist",
    email: "markku@example.com",
    website: "https://markkutauriainen.com",
  },
  organization: {
    name: "Helios Digitech",
    description: "Digital transformation and AI strategy consulting",
    website: "https://heliosdigitech.com",
    logo: "/logo.webp",
  },
  site: {
    name: "Markku Tauriainen",
    description:
      "Personal page of an experienced sales professional and AI strategy expert. I help you see the situation as it is and take the first sensible step forward.",
    url: "https://markkutauriainen.com",
    defaultLocale: "fi",
    locales: ["fi", "en"],
  },
  topics: [
    "Sales",
    "AI Strategy",
    "Entrepreneurship",
    "Digital Transformation",
    "Business Growth",
  ],
  hubPages: {
    sales: {
      title: "Sales",
      description: "Sales strategies, techniques, and insights",
      slug: "sales",
    },
    ai: {
      title: "AI Strategy",
      description: "Artificial intelligence for business",
      slug: "ai",
    },
    entrepreneurship: {
      title: "Entrepreneurship",
      description: "Building and growing businesses",
      slug: "entrepreneurship",
    },
  },
  contentSource: "static",
};
