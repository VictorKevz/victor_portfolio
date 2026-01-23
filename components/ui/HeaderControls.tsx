"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import LightMode from "@mui/icons-material/LightMode";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedPath, removeLocaleFromPath } from "@/lib/i18n/config";

const WP_BASE_URL =
  process.env.NEXT_PUBLIC_WP_BASE_URL ??
  "https://wp.markkutauriainen.com/wp-json/wp/v2";

async function getTranslatedPillarSlug(pillarSlug: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      slug: pillarSlug,
      acf_format: "standard",
      _fields: "acf,slug",
    });
    const response = await fetch(`${WP_BASE_URL}/pillar?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as Array<{
      acf?: {
        pillar_data?: {
          translation_pillar?: { post_name?: string } | false;
        };
      };
    }>;
    const translation = data?.[0]?.acf?.pillar_data?.translation_pillar;
    const translatedSlug =
      translation && typeof translation === "object" ? translation.post_name : null;
    return translatedSlug || null;
  } catch {
    return null;
  }
}

async function getTranslatedPostSlug(postSlug: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      slug: postSlug,
      acf_format: "standard",
      _fields: "acf,slug",
    });
    const response = await fetch(`${WP_BASE_URL}/posts?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as Array<{
      acf?: {
        blog_post?: {
          header?: {
            translation_post?: { post_name?: string } | false;
          };
        };
      };
    }>;
    const translation =
      data?.[0]?.acf?.blog_post?.header?.translation_post ?? false;
    const translatedSlug =
      translation && typeof translation === "object" ? translation.post_name : null;
    return translatedSlug || null;
  } catch {
    return null;
  }
}

interface HeaderControlsProps {
  currentLocale: Locale;
}

export function HeaderControls({ currentLocale }: HeaderControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", currentLocale);
    }
  }, [currentLocale]);

  const handleLanguageChange = async (locale: Locale) => {
    if (locale === currentLocale) return;
    
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }

    const pathWithoutLocale = removeLocaleFromPath(pathname);
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    if (segments[0] === "blog" && segments[1]) {
      const translatedPillar = await getTranslatedPillarSlug(segments[1]);
      if (translatedPillar) {
        segments[1] = translatedPillar;
      }

      if (segments[2]) {
        const translatedPost = await getTranslatedPostSlug(segments[2]);
        if (translatedPost) {
          segments[2] = translatedPost;
        }
      }
    }

    const nextPath = `/${segments.join("/")}`;
    const newPath = getLocalizedPath(nextPath, locale);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center justify-center w-11 h-11 rounded-full border border-(--border-alpha-30) text-(--accent-warm) hover:border-(--accent-warm) transition-all duration-200"
        aria-label="Toggle theme"
      >
        <LightMode className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => handleLanguageChange("fi")}
        className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-200 ${
          currentLocale === "fi"
            ? "border-(--accent-warm)"
            : "border-(--border-alpha-30) hover:border-(--accent-warm)"
        }`}
        aria-label="Suomi"
        aria-pressed={currentLocale === "fi"}
      >
        <Image
          src="/fi.webp"
          alt="Suomi"
          width={24}
          height={18}
          className="w-6 h-auto"
        />
      </button>

      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-200 ${
          currentLocale === "en"
            ? "border-(--accent-warm)"
            : "border-(--border-alpha-30) hover:border-(--accent-warm)"
        }`}
        aria-label="English"
        aria-pressed={currentLocale === "en"}
      >
        <Image
          src="/en.webp"
          alt="English"
          width={24}
          height={18}
          className="w-6 h-auto"
        />
      </button>
    </div>
  );
}

