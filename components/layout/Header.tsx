"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site.config";

interface HeaderProps {
  locale: Locale;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  navItems: Array<{ href: string; label: string }>;
  activeHref: string;
  ctaLabel: string;
  logoLabel: string;
}

function MobileMenu({
  isOpen,
  onClose,
  locale,
  navItems,
  activeHref,
  ctaLabel,
  logoLabel,
}: MobileMenuProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previous;
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-30 lg:hidden overlay backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
        >
          <div
            className="absolute inset-0 bg-(--overlay-dark)"
            aria-hidden="true"
            onClick={onClose}
          />
          <motion.aside
            className="absolute top-0 left-0 h-dvh w-full sm:w-[70vw] panel backdrop-blur py-6 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between border-b border-(--border-light) px-6 pb-6">
              <Logo
                href={`/${locale}`}
                label={typeof logoLabel === "string" ? logoLabel : "Victor"}
                onClick={onClose}
                iconClassName="w-14 h-14"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="h-14 w-14 rounded-full surface-glass text-muted flex items-center justify-center backdrop-blur-md!"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="flex-1 flex items-center px-8">
              <nav
                className="flex flex-col gap-10"
                aria-label="Mobile navigation"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-2xl uppercase tracking-[0.2em] transition-colors ${
                      activeHref === item.href
                        ? "bg-gradient-primary cta rounded-full px-6 h-12 flex items-center justify-center w-fit"
                        : "menu-link"
                    }`}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-(--border-light) px-6 pt-6">
              <Link
                href="#projects"
                className="bg-gradient-primary cta text-sm uppercase tracking-[0.2em] px-6 py-4 rounded-full font-semibold w-fit"
                onClick={onClose}
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function Header({ locale }: HeaderProps) {
  const menuOpenLabel = getTranslation(locale, "header.menu.open");
  const menuCloseLabel = getTranslation(locale, "header.menu.close");
  const ctaLabel = getTranslation(locale, "header.cta.viewProjects");
  const logoLabel = getTranslation(locale, "site.name");
  const englishLabel = getTranslation(locale, "header.locale.english");
  const suomiLabel = getTranslation(locale, "header.locale.suomi");
  const router = useRouter();
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      {
        href: "#home",
        label: getTranslation(locale, "header.nav.home"),
        fallback: "Home",
      },
      {
        href: "#services",
        label: getTranslation(locale, "header.nav.services"),
        fallback: "Services",
      },
      {
        href: "#skills",
        label: getTranslation(locale, "header.nav.skills"),
        fallback: "Skills",
      },

      {
        href: "#contact",
        label: getTranslation(locale, "header.nav.contact"),
        fallback: "Contact",
      },
    ],
    [locale],
  );

  const getLocaleLabel = (loc: "en" | "fi") => {
    if (loc === "en") {
      return typeof englishLabel === "string" ? englishLabel : "English";
    }
    return typeof suomiLabel === "string" ? suomiLabel : "Suomi";
  };

  const getToggleLocale = () => (locale === "en" ? "fi" : "en");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(navItems[0]?.href ?? "#home");
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = navItems
      .map((item) => {
        const id = item.href.replace("#", "");
        return document.getElementById(id);
      })
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "0px 0px -40% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <header className="w-full sticky top-0 left-0 z-20">
      <nav
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Logo
          href={`/${locale}`}
          label={typeof logoLabel === "string" ? logoLabel : "Victor"}
          iconClassName="w-14 h-14"
        />

        <nav aria-label="Primary">
          <ul className="hidden lg:flex items-center gap-2 rounded-full surface-glass px-3 h-12 backdrop-blur">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 text-xs tracking-[0.2em] uppercase transition-colors ${
                    activeHref === item.href
                      ? "bg-gradient-primary cta rounded-full h-8 flex items-center justify-center"
                      : "link-muted"
                  }`}
                  aria-current={activeHref === item.href ? "page" : undefined}
                >
                  {typeof item.label === "string" ? item.label : item.fallback}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="#projects"
            className="bg-gradient-primary cta text-xs uppercase tracking-[0.08em] px-5 h-12 flex items-center justify-center rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {typeof ctaLabel === "string" ? ctaLabel : "View Projects >"}
          </Link>
          <div className="relative group">
            <button
              type="button"
              onClick={() => {
                const nextLocale = getToggleLocale();
                const parts = pathname.split("/");
                const nextPath = `/${[nextLocale, ...parts.slice(2)].filter(Boolean).join("/")}`;
                const hash =
                  typeof window !== "undefined" ? window.location.hash : "";
                router.push(`${nextPath}${hash}`);
              }}
              className="h-12 w-12 rounded-full surface-glass text-muted flex items-center justify-center"
              aria-label={`Switch language to ${getLocaleLabel(getToggleLocale())}`}
            >
              <Image
                src={`/${locale}.webp`}
                alt={`${locale.toUpperCase()} flag`}
                width={24}
                height={24}
              />
            </button>
            <span className="pointer-events-none absolute top-full right-0 mt-2 px-3 py-2 rounded-full surface-glass text-xs uppercase tracking-[0.2em] text-muted opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              {getLocaleLabel(getToggleLocale())}
            </span>
          </div>
        </div>

        {!isMenuOpen ? (
          <button
            type="button"
            className="lg:hidden h-12 w-12 text-xs uppercase tracking-[0.2em] text-muted surface-glass rounded-full backdrop-blur flex items-center justify-center"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            aria-label={
              typeof menuOpenLabel === "string" ? menuOpenLabel : "Menu"
            }
          >
            <MenuIcon fontSize="small" />
          </button>
        ) : null}
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        locale={locale}
        navItems={navItems.map(({ href, label, fallback }) => ({
          href,
          label: typeof label === "string" ? label : fallback,
        }))}
        activeHref={activeHref}
        ctaLabel={typeof ctaLabel === "string" ? ctaLabel : "View Projects >"}
        logoLabel={typeof logoLabel === "string" ? logoLabel : "Victor"}
      />
    </header>
  );
}
