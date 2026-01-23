import { getHomePageData } from '@/lib/wordpress/api';
import HeroSection from '@/components/sections/HeroSection';
import MarkkuSection from '@/components/sections/MarkkuSection';
import ContactSection from '@/components/sections/ContactSection';
import { isValidLocale, type Locale } from '@/lib/i18n/config';
import { siteConfig } from '@/config/site.config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

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

  try {
    const wpData = await getHomePageData(locale);
    const seo = locale === 'en' ? wpData.acf.seo_en : wpData.acf.seo_fi;
    const defaultUrl = `${siteConfig.site.url}/${locale}`;

    return {
      title: seo?.meta_title || siteConfig.site.name,
      description: seo?.meta_description || siteConfig.site.description,
      alternates: {
        canonical: seo?.canonical || defaultUrl,
      },
    };
  } catch {
    return {};
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  try {
    const wpData = await getHomePageData(locale);
    
    return (
      <>
        <HeroSection data={wpData.acf.hero_section} locale={locale} />
        <MarkkuSection data={wpData.acf.markku_section} />
        <ContactSection data={wpData.acf.contact_section} locale={locale} />
      </>
    );
  } catch (error) {
    // Re-throw error to trigger error.tsx
    throw error;
  }
}
