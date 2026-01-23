import { notFound } from "next/navigation";
import { SkipLink } from "@/components/layout/SkipLink";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { siteConfig } from "@/config/site.config";
import { generateAuthorSchema } from "@/lib/structured-data/author";
import { generateOrganizationSchema } from "@/lib/structured-data/organization";
import type { Metadata } from "next";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.site.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const url = `${siteConfig.site.url}/${locale}`;
  const alternateUrls = siteConfig.site.locales.map((loc) => ({
    url: `${siteConfig.site.url}/${loc}`,
    hreflang: loc,
  }));

  return {
    alternates: {
      canonical: url,
      languages: {
        "en": `${siteConfig.site.url}/en`,
        "fi": `${siteConfig.site.url}/fi`,
        "x-default": `${siteConfig.site.url}/${siteConfig.site.defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const authorSchema = generateAuthorSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <SkipLink />
      <HeaderWrapper locale={locale as Locale} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(authorSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}

