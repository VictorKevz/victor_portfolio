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
  contentSource: "static";
}

export const siteConfig: SiteConfig = {
  author: {
    firstName: "Victor",
    lastName: "Kuwandira",
    name: "Victor Kuwandira",
    bio: "",
    role: "",
    website: "https://victorkevz.com",
  },
  organization: {
    name: "Victor Kuwandira",
    description: "",
    website: "https://victorkevz.com",
    logo: "/victor_logo.webp",
  },
  site: {
    name: "Victor Kuwandira",
    description: "",
    url: "https://victorkevz.com",
    defaultLocale: "en",
    locales: ["en", "fi"],
  },
  topics: [],
  contentSource: "static",
};
