import type { Locale } from "@/lib/i18n/config";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export type AuthState = "loading" | "authenticated" | "denied" | "error";

export interface MiniCourseTranslations {
  locale: Locale;
}

export interface VideoData {
  key: string;
  url: string | null;
  thumbnail: string | null;
  label: string;
  title: string;
  duration: string;
  description: string;
  reflection: string;
}

export const VIDEO_URLS = {
  customerFirst: {
    fi: "https://markkutauriainen.b-cdn.net/video_1_fi.mp4",
    en: "https://markkutauriainen.b-cdn.net/video_1_en.mp4",
  },
  clarityFirst: {
    fi: null as string | null,
    en: null as string | null,
  },
  valueFirst: {
    fi: null as string | null,
    en: null as string | null,
  },
};

export const VIDEO_THUMBNAILS = {
  customerFirst: {
    fi: "https://markkutauriainen.b-cdn.net/video_1_fi_thumbnail.webp",
    en: "https://markkutauriainen.b-cdn.net/video_1_en_thumbnail.webp",
  },
  clarityFirst: {
    fi: null as string | null,
    en: null as string | null,
  },
  valueFirst: {
    fi: null as string | null,
    en: null as string | null,
  },
};

export const MARKKU_AVATAR =
  "https://markkutauriainen.b-cdn.net/LMM%20Experience%20Markku%20Tauriainen%20round%20picture%202026.webp";

