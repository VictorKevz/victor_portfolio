import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/config/site.config";
import { getTranslation } from "@/lib/i18n/translations";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const defaultUrl = `${siteConfig.site.url}/${locale}`;
  const title = getTranslation(locale, "meta.title");
  const description = getTranslation(locale, "meta.description");
  const keywords = getTranslation(locale, "meta.keywords");

  return {
    title: typeof title === "string" ? title : siteConfig.site.name,
    description:
      typeof description === "string"
        ? description
        : siteConfig.site.description,
    keywords:
      Array.isArray(keywords) && keywords.every((k) => typeof k === "string")
        ? (keywords as string[])
        : undefined,
    alternates: {
      canonical: defaultUrl,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <main className="w-full">
      <HeroSection locale={locale as Locale} />
      <ProjectsSection locale={locale as Locale} />
      <SkillsSection locale={locale as Locale} />
      <TestimonialsSection locale={locale as Locale} />
      <ServicesSection locale={locale as Locale} />
      <ExperienceSection locale={locale as Locale} />
      <AboutSection locale={locale as Locale} />
      <ContactSection locale={locale as Locale} />
    </main>
  );
}
