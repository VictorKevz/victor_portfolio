"use client";

import { Button } from "@/components/ui/Button";
import type { HeroSection as HeroSectionData } from "@/lib/wordpress/types";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/config";

interface HeroSectionProps {
  data: HeroSectionData;
  locale: Locale;
}

export default function HeroSection({ data, locale }: HeroSectionProps) {
  const handleScrollToMarkku = () => {
    const markkuSection = document.getElementById("markku-section");
    if (markkuSection) {
      markkuSection.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  };

  const descriptions = [
    data.hero_descriptions?.description_1,
    data.hero_descriptions?.description_2,
    data.hero_descriptions?.description_3,
    data.hero_descriptions?.description_4,
  ].filter((desc): desc is string => Boolean(desc));

  return (
    <section className="py-12 sm:py-16 lg:py-24 flex flex-col items-center justify-center md:text-center">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-hero leading-tight mb-4">
            {data.hero_title || ''}
            {data.hero_subheading && (
              <span className="text-3xl lg:text-4xl text-(--accent-warm) font-light block">
                {data.hero_subheading}
              </span>
            )}
          </h1>

          {data.hero_blockquote && (
            <blockquote className="text-2xl sm:text-3xl lg:text-5xl text-(--accent-warm) my-8 ">
              "{data.hero_blockquote}"
            </blockquote>
          )}

          <div className="mt-4! text-left md:text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              {descriptions.map((paragraph, index) => {
                if (!paragraph.trim()) {
                  return <br key={index} />;
                }
                return (
                  <p
                    key={index}
                    className="text-lg"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col mt-6 sm:flex-row gap-4 justify-start md:justify-center w-full max-w-xs md:mx-auto">
            {data.hero_cta && (
              <Button
                variant="primary"
                onClick={handleScrollToMarkku}
                className="w-full mt-6 font-semibold"
              >
                {data.hero_cta}
              </Button>
            )}
            {data.hero_blog_cta && (
              <Link
                href={getLocalizedPath("/blog", locale)}
                className="mt-6 inline-flex items-center gap-2 justify-center px-6 py-3 rounded text-base transition-all duration-200 focus-visible:outline focus-visible:outline-offset-2 bg-(--secondary) text-(--foreground) border border-(--accent-warm) hover:bg-(--muted) focus-visible:outline-(--accent-warm) w-full font-semibold"
              >
                  {data.hero_blog_cta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
