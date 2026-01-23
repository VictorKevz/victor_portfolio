import type { BlogPost } from "@/lib/wordpress/types";
import { parseSmartList } from "./utils";

interface ContentSectionsProps {
  post: BlogPost;
}

export default function ContentSections({ post }: ContentSectionsProps) {
  if (!post) {
    return null;
  }

  const body = post.acf?.blog_post?.body;
  const others = post.acf?.blog_post?.others;

  const overview = body?.quick_overview;
  const sections = [
    {
      id: "why-this-matters",
      title: overview?.overview_why || "",
      content: body?.content_why_it_matters,
    },
    {
      id: "common-mistakes",
      title: overview?.overview_mistakes || "",
      content: body?.content_common_mistakes,
    },
    {
      id: "correct-routine",
      title: overview?.overview_routine || "",
      content: body?.content_routine_steps,
    },
    {
      id: "professional-view",
      title: overview?.overview_expert || "",
      content: others?.content_expert_insight,
    },
    {
      id: "suitability",
      title: overview?.overview_suitability || "",
      content: others?.content_suitability_check,
    },
    {
      id: "summary",
      title: overview?.overview_summary || "",
      content: others?.content_summary_section?.["3_line_summary"],
      cta: others?.content_summary_section?.next_step_cta,
    },
  ].filter((section) => section.content && section.title);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              {section.title}
            </h2>
            <div className="prose prose-lg max-w-none">
              {section.content === body?.content_common_mistakes ||
              section.content === body?.content_routine_steps ? (
                parseSmartList(section.content)
              ) : (
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
            </div>
            {section.cta && (
              <div className="mt-6">
                <div className="inline-block px-6 py-3 bg-(--accent-warm-alpha-10) border border-(--accent-warm-alpha-30)">
                  <p className="text-base font-medium text-(--accent-warm)">
                    {section.cta}
                  </p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
