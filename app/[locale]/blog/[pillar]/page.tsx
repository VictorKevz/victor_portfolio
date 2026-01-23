import { getPostsByPillar, getPillarBySlug } from "@/lib/wordpress/blog";
import { isValidLocale, type Locale, getLocalizedPath } from "@/lib/i18n/config";
import { decodeHtmlEntities } from "@/lib/utils/html";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    locale: string;
    pillar: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, pillar } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  try {
    // Try to get pillar to use its title
    const pillarData = await getPillarBySlug(pillar);
    const title = pillarData?.title?.rendered || pillar;

    return {
      title,
      description: `${title} - ${locale === "en" ? "Blog articles" : "Blogiartikkelit"}`,
    };
  } catch {
    return {
      title: pillar,
    };
  }
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { locale, pillar } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  try {
    const pillarData = await getPillarBySlug(pillar);
    
    if (!pillarData) {
      notFound();
    }

    const posts = await getPostsByPillar(locale, pillarData.id);

    const blogHubPath = getLocalizedPath("/blog", locale);

    return (
      <div className="min-h-screen">
        <main className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={blogHubPath}
              className="inline-block mb-6 text-(--accent-warm) hover:opacity-80 underline"
            >
              ← {locale === "en" ? "Back to Blog" : "Takaisin blogiin"}
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-hero mb-4">
              {decodeHtmlEntities(pillarData.title?.rendered || "Category")}
            </h1>
            {pillarData.acf?.pillar_data?.pillar_intro && (
              <p className="text-base sm:text-lg text-(--text-body) leading-relaxed mb-6">
                {pillarData.acf?.pillar_data?.pillar_intro}
              </p>
            )}

            {posts.length === 0 ? (
              <p className="text-lg text-(--text-subtle)">
                {locale === "en"
                  ? "No articles available in this category yet."
                  : "Tässä kategoriassa ei ole vielä artikkeleita."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const postLink = getLocalizedPath(
                    `/blog/${pillar}/${post.slug}`,
                    locale
                  );
                  const intro = decodeHtmlEntities(
                    post.acf?.blog_post?.header?.post_ingress || ""
                  );
                  const author = post.acf?.blog_post?.header?.author || "";
                  const readTimeValue = post.acf?.blog_post?.header?.read_time;
                  const readTime =
                    typeof readTimeValue === "number" && readTimeValue > 0
                      ? locale === "en"
                        ? `${readTimeValue} min read`
                        : `${readTimeValue} min lukua`
                      : "";
                  const metaParts = [author, readTime].filter(Boolean).join(" • ");
                  return (
                    <article
                      key={post.id}
                      className="p-6 bg-(--surface-card) rounded-lg hover:bg-(--surface-card-hover) transition-colors"
                    >
                      <Link href={postLink}>
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-(--text-hero)">
                          {decodeHtmlEntities(post.title?.rendered || "Untitled")}
                        </h2>
                        {intro && (
                          <p className="text-(--text-body) line-clamp-2">
                            {intro}
                          </p>
                        )}
                        {(author || readTime) && (
                          <div className="text-sm text-(--text-subtle) mt-3 flex items-center justify-between gap-3">
                            <span>{author}</span>
                            <span>{readTime}</span>
                          </div>
                        )}
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog category:", error);
    throw error;
  }
}
