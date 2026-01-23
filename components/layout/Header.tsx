"use client";

import Link from "next/link";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { siteConfig } from "@/config/site.config";
import type { Locale } from "@/lib/i18n/config";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  return (
    <header className="w-full">
      <nav
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xl font-semibold text-(--foreground) hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-(--accent-warm) focus-visible:outline-offset-2 rounded"
        >
          <span className="text-(--foreground)">
            {siteConfig.author.firstName}
          </span>{" "}
          <span className="text-(--foreground) hidden md:inline">
            {siteConfig.author.lastName}
          </span>
        </Link>

        <HeaderControls currentLocale={locale} />
      </nav>
    </header>
  );
}
