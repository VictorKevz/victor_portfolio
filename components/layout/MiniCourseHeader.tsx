"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import LightMode from "@mui/icons-material/LightMode";
import { Warning } from "@mui/icons-material";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";

const leaveWarning = {
  en: {
    title: "Leave Course?",
    message: "If you leave, you'll need to use the original link from your email to return.",
    stay: "Stay",
    leave: "Leave",
  },
  fi: {
    title: "Poistu kurssilta?",
    message: "Jos poistut, sinun täytyy käyttää sähköpostissa olevaa alkuperäistä linkkiä palataksesi.",
    stay: "Jää",
    leave: "Poistu",
  },
};

export function MiniCourseHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const langParam = searchParams.get("lang");
  const currentLocale: Locale = langParam === "fi" ? "fi" : "en";
  const token = searchParams.get("ref");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLeaveModal(true);
  };

  const handleLeave = () => {
    setShowLeaveModal(false);
    router.push(`/${currentLocale}`);
  };

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    const params = new URLSearchParams();
    if (token) params.set("ref", token);
    params.set("lang", locale);
    router.push(`/mini-course?${params.toString()}`);
  };

  const t = leaveWarning[currentLocale];

  return (
    <>
      <header className="w-full sticky top-0 left-0 right-0 z-50">
        <nav
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-semibold text-(--foreground) hover:opacity-80 transition-opacity"
          >
            <span className="text-(--foreground)">{siteConfig.author.firstName}</span>{" "}
            <span className="text-(--foreground) hidden md:inline">
              {siteConfig.author.lastName}
            </span>
          </button>

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
        </nav>
      </header>

      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-(--overlay-60) backdrop-blur-sm">
          <div className="bg-(--background) border border-(--border) rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-(--accent-warm-alpha-20) flex items-center justify-center">
                <Warning className="w-5 h-5 text-(--accent-warm)" />
              </div>
              <h2 className="text-xl font-bold text-(--text-hero)">
                {t.title}
              </h2>
            </div>

            <p className="text-(--text-body) mb-6">{t.message}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-2.5 bg-(--accent-warm) text-(--background) rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t.stay}
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 px-4 py-2.5 border border-(--border) text-(--text-body) rounded-lg font-medium hover:bg-(--secondary) transition-colors"
              >
                {t.leave}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

