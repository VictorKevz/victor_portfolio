import Link from "next/link";
import type { BlogPost, PillarPost } from "@/lib/wordpress/types";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/config";
import { decodeHtmlEntities } from "@/lib/utils/html";

interface RelatedContentProps {
  pillar: PillarPost | null;
  relatedPosts: BlogPost[];
  locale: Locale;
}

type RelatedCard =
  | {
      type: "pillar";
      id: number;
      title: string;
      link: string;
    }
  | {
      type: "post";
      id: number;
      title: string;
      link: string;
      excerpt: string;
    };

export default function RelatedContent({
  pillar,
  relatedPosts,
  locale,
}: RelatedContentProps) {
  const cards: RelatedCard[] = [];

  // Add pillar card first
  if (pillar) {
    cards.push({
      type: "pillar" as const,
      id: pillar.id,
      title: decodeHtmlEntities(pillar.title?.rendered || ""),
      link: getLocalizedPath(`/blog/${pillar.slug}`, locale),
    });
  }

  // Add related posts
  relatedPosts.forEach((post) => {
    // Use WordPress link if available, otherwise construct from slug
    // Note: WordPress link should be canonical, but we fallback to manual construction
    const postLink = pillar
      ? getLocalizedPath(`/blog/${pillar.slug}/${post.slug}`, locale)
      : getLocalizedPath(`/blog/${post.slug}`, locale);

    const excerptText = decodeHtmlEntities(
      (post.excerpt?.rendered || "").replace(/<[^>]*>/g, "")
    );

    cards.push({
      type: "post" as const,
      id: post.id,
      title: decodeHtmlEntities(post.title?.rendered || ""),
      link: postLink,
      excerpt: excerptText,
    });
  });

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 border-t border-(--border)">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          Read also
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="block p-6 bg-(--surface-card) border border-(--border) hover:bg-(--surface-card-hover) transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {card.title}
              </h3>
              {card.type === "post" && card.excerpt && (
                <p className="text-sm text-(--text-subtle) line-clamp-3">
                  {card.excerpt}
                </p>
              )}
              {card.type === "pillar" && (
                <p className="text-sm text-(--text-subtle)">
                  View all articles
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
