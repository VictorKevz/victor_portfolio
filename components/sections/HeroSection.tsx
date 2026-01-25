import Link from "next/link";
import Image from "next/image";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import type { Locale } from "@/lib/i18n/config";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { getTranslation } from "@/lib/i18n/translations";
import { BadgeWrapper } from "@/components/ui/BadgeWrapper";
import { GradientText } from "@/components/ui/GradientText";
import { CTALink } from "@/components/ui/CTALink";

interface HeroSectionProps {
  locale: Locale;
}

interface LocationPillProps {
  location: string;
}

function LocationPill({ location }: LocationPillProps) {
  return (
    <div
      className="inline-flex rounded-full p-px"
      style={{ background: "var(--gradient-secondary)" }}
    >
      <div className="flex items-center gap-2 rounded-full bg-(--neutral-0)/80 px-4 py-2">
        <RoomOutlinedIcon
          className="text-on-primary body-text-dark"
          fontSize="small"
        />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-on-primary body-text-dark">
          {location}
        </span>
      </div>
    </div>
  );
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const label = getTranslation(locale, "hero.label");
  const title = getTranslation(locale, "hero.title");
  const description = getTranslation(locale, "hero.description");
  const primaryCta = getTranslation(locale, "hero.cta.primary");
  const secondaryCta = getTranslation(locale, "hero.cta.secondary");
  const badgeTitle = getTranslation(locale, "hero.badge.title");
  const badgeItems = getTranslation(locale, "hero.badge.items");
  const location = getTranslation(locale, "hero.location");

  const badgeList = Array.isArray(badgeItems)
    ? (badgeItems.filter(
        (item): item is string => typeof item === "string",
      ) as string[])
    : [];

  const descriptionParts =
    typeof description === "object" &&
    description !== null &&
    !Array.isArray(description)
      ? (description as Record<string, string>)
      : null;

  return (
    <div className="relative w-full ">
      <section
        id="home"
        className="min-h-dvh max-w-screen-2xl mx-auto w-full relative overflow-hidden flex flex-col justify-between 2xl:justify-start 2xl:items-center"
      >
        <HeaderWrapper locale={locale} />
        <div className="relative z-10  w-full px-4 sm:px-6 lg:px-8 py-10 2xl:mt-20">
          <div className="max-w-xl ">
            <div className="md:hidden mb-6">
              <div className="h-22 w-22 rounded-full bg-gradient-primary flex items-center justify-center">
                <Image
                  src="/victor_no_bg.png"
                  alt="Victor Kuwandira portrait"
                  width={75}
                  height={75}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="inline-flex items-center rounded-full surface-glass px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
              {label as string}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-semibold text-primary uppercase max-w-xs">
              {title as string}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl body-text-light max-w-xl mb-6">
              {descriptionParts ? (
                <>
                  {descriptionParts.intro}
                  <GradientText text={descriptionParts.highlightUserCentered} />
                  {descriptionParts.mid}
                  <GradientText
                    text={descriptionParts.highlightScalable}
                    className="text-gradient-secondary"
                  />
                  {descriptionParts.outro}
                  {descriptionParts.stack}
                </>
              ) : (
                (description as string)
              )}
            </p>
            <LocationPill location={location as string} />
            <div className="mt-8 flex flex-wrap gap-3">
              <CTALink
                href="#projects"
                label={primaryCta as string}
                variant="primary"
              />
              <CTALink
                href="#contact"
                label={secondaryCta as string}
                variant="secondary"
              />
            </div>
          </div>
        </div>

        {/* Mobile Badge Wrapper */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 lg:hidden pb-10">
          <BadgeWrapper title={badgeTitle as string} items={badgeList} />
        </div>

        {/* Desktop Badge Wrapper */}
        <div className="hidden lg:block absolute z-10 right-10 bottom-5">
          <BadgeWrapper title={badgeTitle as string} items={badgeList} />
        </div>

        {/* Large Screen Arrow Down */}
        <Link
          href="#services"
          aria-label="Scroll to services"
          className="hidden 2xl:flex absolute bottom-5 left-8 w-22 h-22 items-center justify-center surface-glass rounded-full overflow-hidden"
        >
          <span className="flex items-center justify-center animate-arrow-down">
            <KeyboardDoubleArrowDownIcon className="text-primary text-4xl! block" />
          </span>
        </Link>
      </section>
      {/* Portrait Image */}
      <div className="hidden md:flex absolute right-0 bottom-0 w-full h-full items-end justify-end pointer-events-none">
        <Image
          src="/victor_no_bg.png"
          alt="Victor Kuwandira portrait"
          width={1000}
          height={900}
          priority
          className="w-full h-full object-cover object-bottom-right lg:w-[55vw] 2xl:w-[50vw]"
        />
      </div>
    </div>
  );
}
