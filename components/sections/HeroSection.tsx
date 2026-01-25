import Link from "next/link";
import Image from "next/image";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import type { Locale } from "@/lib/i18n/config";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { getTranslation } from "@/lib/i18n/translations";
import { BadgeWrapper } from "@/components/ui/BadgeWrapper";

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
      <div className="flex items-center gap-2 rounded-full bg-(--neutral-0)/90 px-4 py-2">
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

  return (
    <section
      id="home"
      className="min-h-dvh max-w-screen-2xl mx-auto w-full relative overflow-hidden flex flex-col justify-between xl:justify-start"
    >
      <HeaderWrapper locale={locale} />
      <div className="relative z-10  w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end">
          <div className="max-w-xl">
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
              {typeof label === "string" ? label : "Web Developer"}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-semibold text-primary uppercase max-w-xs">
              {typeof title === "string" ? title : "I'm Victor"}
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl body-text-light max-w-xl mb-6">
              {typeof description === "string"
                ? description
                : "Frontend-focused web developer building scalable, user-centered digital products."}
            </p>
            <LocationPill
              location={
                typeof location === "string" ? location : "Oulu, Finland"
              }
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#projects"
                className="bg-gradient-primary cta text-xs uppercase tracking-[0.2em] px-6 h-12 flex items-center justify-center rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                {typeof primaryCta === "string" ? primaryCta : "View Projects"}
              </Link>
              <Link
                href="#contact"
                className="surface-glass bg-(--surface-card-dark)! text-xs uppercase tracking-[0.2em] px-6 h-12 flex items-center justify-center rounded-full text-primary"
              >
                {typeof secondaryCta === "string"
                  ? secondaryCta
                  : "Get in Touch"}
              </Link>
            </div>
          </div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 lg:hidden pb-10">
        <BadgeWrapper
          title={
            typeof badgeTitle === "string" ? badgeTitle : "Core Capabilities"
          }
          items={badgeList}
        />
      </div>
      <div className="hidden lg:block absolute z-10 right-10 bottom-5">
        <BadgeWrapper
          title={
            typeof badgeTitle === "string" ? badgeTitle : "Core Capabilities"
          }
          items={badgeList}
        />
      </div>
      <div className="hidden md:flex fixed right-0 bottom-0 w-full h-full items-end justify-end pointer-events-none">
        <Image
          src="/victor_no_bg.png"
          alt="Victor Kuwandira portrait"
          width={1000}
          height={900}
          priority
          className="w-full h-full object-cover object-bottom-right lg:w-[55vw] 2xl:w-[50vw]"
        />
      </div>
      <div className="hidden 2xl:flex absolute bottom-5 left-8 w-22 h-22 items-center justify-center surface-glass rounded-full animate-arrow-down">
        <KeyboardDoubleArrowDownIcon
          className="text-primary block"
          fontSize="large"
        />
      </div>
    </section>
  );
}
