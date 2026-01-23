import {
  getSinglePostPageData,
  getPillarById,
} from "@/lib/wordpress/blog";
import { isValidLocale, type Locale, getLocalizedPath } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BlogHeroSection from "@/components/blog/HeroSection";
import QuickOverview from "@/components/blog/QuickOverview";
import ContentSections from "@/components/blog/ContentSections";
import RelatedContent from "@/components/blog/RelatedContent";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    locale: string;
    pillar: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  try {
    const pageData = await getSinglePostPageData(locale, slug);
    if (!pageData) {
      return {};
    }

    const title = pageData.post.title?.rendered || "";
    const excerpt = pageData.post.excerpt?.rendered || "";

    return {
      title,
      description: excerpt.replace(/<[^>]*>/g, "").substring(0, 160),
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, pillar, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  try {
    const pageData = await getSinglePostPageData(locale, slug);

    if (!pageData) {
      notFound();
    }

    const { post, pillar: pillarData, relatedPosts } = pageData;

    // Validate that the pillar slug matches
    const rawParent = post.acf?.blog_post?.header?.parent_pillar;
    const postPillarId =
      typeof rawParent === "number"
        ? rawParent
        : typeof rawParent === "object" && rawParent?.ID
          ? rawParent.ID
          : null;

    const finalPillar =
      pillarData || (postPillarId ? await getPillarById(postPillarId) : null);
    
    // Validate pillar slug matches if we have pillar data
    if (finalPillar && finalPillar.slug !== pillar) {
      notFound();
    }

    const pillarLink = finalPillar
      ? getLocalizedPath(`/blog/${finalPillar.slug}`, locale)
      : getLocalizedPath("/blog", locale);

    return (
      <div className="min-h-screen">
        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={pillarLink}
              className="inline-block mb-6 text-(--accent-warm) hover:opacity-80 underline"
            >
              ← {locale === "en" ? "Back to Category" : "Takaisin kategoriaan"}
            </Link>

            <BlogHeroSection post={post} />
            <QuickOverview post={post} />
            <ContentSections post={post} />
            <RelatedContent
              pillar={finalPillar}
              relatedPosts={relatedPosts}
              locale={locale}
            />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}
