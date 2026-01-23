import Image from "next/image";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { MARKKU_AVATAR } from "./types";

interface HeroSectionProps {
  locale: Locale;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const eyebrow = getTranslation(locale, "miniCourse.hero.eyebrow");
  const title = getTranslation(locale, "miniCourse.hero.title");
  const subtitle = getTranslation(locale, "miniCourse.hero.subtitle");
  const description = getTranslation(locale, "miniCourse.hero.description");
  const ctaBack = getTranslation(locale, "miniCourse.hero.ctaBack");

  return (
    <section className="text-center py-12 sm:py-16">
      <p className="text-(--accent-warm) text-xs sm:text-sm uppercase tracking-widest font-medium mb-4">
        {typeof eyebrow === "string" ? eyebrow : ""}
      </p>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--text-hero) mb-4 max-w-3xl mx-auto leading-tight">
        {typeof title === "string" ? title : ""}
      </h1>

      <p className="text-(--text-body) text-base sm:text-lg mb-2 max-w-2xl mx-auto">
        {typeof subtitle === "string" ? subtitle : ""}
      </p>

      <p className="text-(--accent-warm) text-sm sm:text-base mb-8 max-w-xl mx-auto">
        {typeof description === "string" ? description : ""}
      </p>

      {/* Profile Image with Social Links */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <a
          href="https://www.linkedin.com/in/markkutauriainen/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--text-subtle) hover:text-(--accent-warm) transition-colors"
          aria-label="LinkedIn"
        >
          <LinkedInIcon className="w-5 h-5" />
        </a>

        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <Image
            src={MARKKU_AVATAR}
            alt="Markku Tauriainen"
            fill
            className="rounded-full object-cover border-2 border-(--border)"
            priority
          />
        </div>

        <a
          href="mailto:info@heliosdigitech.com"
          className="text-(--text-subtle) hover:text-(--accent-warm) transition-colors"
          aria-label="Email"
        >
          <EmailIcon className="w-5 h-5" />
        </a>
      </div>

      {/* CTA Button */}
      <Link
        href={`/${locale}`}
        className="inline-block px-6 py-3 bg-(--accent-warm) text-(--background) rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        {typeof ctaBack === "string" ? ctaBack : "Back to homepage"}
      </Link>
    </section>
  );
}

