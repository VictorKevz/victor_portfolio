import type { BlogPost } from "@/lib/wordpress/types";

interface QuickOverviewProps {
  post: BlogPost;
}

export default function QuickOverview({ post }: QuickOverviewProps) {
  if (!post) {
    return null;
  }

  const overview = post.acf?.blog_post?.body?.quick_overview;

  if (!overview) {
    return null;
  }

  const anchors = [
    { key: "overview_why", id: "why-this-matters", label: overview.overview_why },
    { key: "overview_mistakes", id: "common-mistakes", label: overview.overview_mistakes },
    { key: "overview_routine", id: "correct-routine", label: overview.overview_routine },
    { key: "overview_expert", id: "professional-view", label: overview.overview_expert },
    { key: "overview_suitability", id: "suitability", label: overview.overview_suitability },
    { key: "overview_summary", id: "summary", label: overview.overview_summary },
  ].filter((item) => item.label);

  if (anchors.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-(--surface-card) border border-(--border) p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            In this article
          </h2>
          <nav>
            <ul className="space-y-2">
              {anchors.map((anchor) => (
                <li key={anchor.key}>
                  <a
                    href={`#${anchor.id}`}
                    className="text-base text-(--accent-warm) hover:opacity-80 underline transition-colors"
                  >
                    {anchor.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
