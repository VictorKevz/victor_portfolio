"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import LightMode from "@mui/icons-material/LightMode";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedPath, removeLocaleFromPath } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";

interface HeaderControlsProps {
  currentLocale: Locale;
}

export function HeaderControls({ currentLocale }: HeaderControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const toggleLabel = getTranslation(currentLocale, "header.toggleTheme");
  const labelFi = getTranslation(currentLocale, "header.language.fi");
  const labelEn = getTranslation(currentLocale, "header.language.en");

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
    const nextPath = pathWithoutLocale.startsWith("/")
      ? pathWithoutLocale
      : `/${pathWithoutLocale}`;
    const newPath = getLocalizedPath(nextPath, locale);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center justify-center w-11 h-11 rounded-full border border-(--border-alpha-30) text-(--accent-warm) hover:border-(--accent-warm) transition-all duration-200"
        aria-label={typeof toggleLabel === "string" ? toggleLabel : "Toggle theme"}
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
        aria-label={typeof labelFi === "string" ? labelFi : "Suomi"}
        aria-pressed={currentLocale === "fi"}
      >
        <Image
          src="/fi.webp"
          alt={typeof labelFi === "string" ? labelFi : "Suomi"}
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
        aria-label={typeof labelEn === "string" ? labelEn : "English"}
        aria-pressed={currentLocale === "en"}
      >
        <Image
          src="/en.webp"
          alt={typeof labelEn === "string" ? labelEn : "English"}
          width={24}
          height={18}
          className="w-6 h-auto"
        />
      </button>
    </div>
  );
}

