import { getBlogHubHeader, getBlogPillars, getPostsByPillar } from "@/lib/wordpress/blog";
import { isValidLocale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/config";
import { decodeHtmlEntities } from "@/lib/utils/html";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ArrowForward from "@mui/icons-material/ArrowForward";

export const dynamic = "force-dynamic";

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

  let header: Awaited<ReturnType<typeof getBlogHubHeader>> = null;
  try {
    header = await getBlogHubHeader(locale);
  } catch {
    header = null;
  }

  const title = header?.hub_title || (locale === "en" ? "Blog" : "Blogi");
  const description =
    header?.hub_description ||
    (locale === "en"
      ? "Articles and insights on sales, AI strategy, and entrepreneurship"
      : "Artikkelit ja oivallukset myynnistä, AI-strategiasta ja yrittäjyydestä");

  return {
    title,
    description,
  };
}

export default async function BlogHubPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  try {
    const [pillars, header] = await Promise.all([
      getBlogPillars(locale),
      getBlogHubHeader(locale),
    ]);
    const pillarPosts = await Promise.all(
      pillars.map((pillar) => getPostsByPillar(locale, pillar.id, 1, 100))
    );
    const pillarCounts = new Map(
      pillars.map((pillar, index) => [pillar.id, pillarPosts[index]?.length ?? 0])
    );

    return (
      <div className="min-h-screen">
        <main className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-hero mb-4">
                {header?.hub_title || (locale === "en" ? "Blog" : "Blogi")}
              </h1>
              {header?.hub_description && (
                <p className="text-base sm:text-lg text-(--text-body) leading-relaxed mb-4 max-w-2xl mx-auto">
                  {header.hub_description}
                </p>
              )}
              {header?.hub_subtext && (
                <p className="text-xs tracking-widest uppercase text-(--accent-warm)">
                  {header.hub_subtext}
                </p>
              )}
            </section>

            {pillars.length === 0 ? (
              <p className="text-lg text-(--text-subtle)">
                {locale === "en"
                  ? "No categories available yet."
                  : "Kategorioita ei ole vielä saatavilla."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                {pillars.map((pillar) => {
                  const pillarLink = getLocalizedPath(
                    `/blog/${pillar.slug}`,
                    locale
                  );
                  const intro = pillar.acf?.pillar_data?.pillar_intro;
                  const count = pillarCounts.get(pillar.id) ?? 0;
                  const countLabel =
                    locale === "en"
                      ? `${count} ${count === 1 ? "article" : "articles"}`
                      : `${count} ${count === 1 ? "artikkeli" : "artikkelia"}`;
                  return (
                    <Link
                      key={pillar.id}
                      href={pillarLink}
                      className="group relative block p-6 pb-12 bg-(--surface-card) border border-(--border) hover:bg-(--surface-card-hover)"
                    >
                      <h2 className="text-xl font-semibold mb-3">
                        {decodeHtmlEntities(pillar.title?.rendered || "Untitled")}
                      </h2>
                      {intro && (
                        <p className="text-sm text-(--text-body) leading-relaxed mb-4">
                          {intro}
                        </p>
                      )}
                      <p className="text-sm text-(--text-subtle)">{countLabel}</p>
                      <span className="absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-warm) text-(--text-on-primary) opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowForward fontSize="small" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog pillars:", error);
    throw error;
  }
}
