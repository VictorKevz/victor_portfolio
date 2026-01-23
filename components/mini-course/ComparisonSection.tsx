import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface ComparisonSectionProps {
  locale: Locale;
}

export default function ComparisonSection({ locale }: ComparisonSectionProps) {
  const eyebrow = getTranslation(locale, "miniCourse.comparison.eyebrow");
  const heading = getTranslation(locale, "miniCourse.comparison.heading");
  const traditionalLabel = getTranslation(
    locale,
    "miniCourse.comparison.traditional.label"
  );
  const traditionalItems = getTranslation(
    locale,
    "miniCourse.comparison.traditional.items"
  );
  const notebookLabel = getTranslation(
    locale,
    "miniCourse.comparison.notebook.label"
  );
  const notebookItems = getTranslation(
    locale,
    "miniCourse.comparison.notebook.items"
  );

  return (
    <section className="py-12 sm:py-16 bg-(--secondary) -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-(--accent-warm) text-xs uppercase tracking-widest font-medium mb-4">
          {typeof eyebrow === "string" ? eyebrow : ""}
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--text-hero) mb-10">
          {typeof heading === "string" ? heading : ""}
        </h2>

        {/* Comparison Table */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10">
          {/* Traditional Column */}
          <div>
            <h3 className="text-(--text-subtle) text-sm font-medium mb-6">
              {typeof traditionalLabel === "string" ? traditionalLabel : ""}
            </h3>
            <ul className="space-y-3">
              {Array.isArray(traditionalItems) &&
                traditionalItems.map((item, index) => (
                  <li key={index}>
                    <span className="block w-full py-2.5 px-4 text-sm text-(--text-subtle) border border-(--border) rounded-md">
                      {item}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Notebook LLM Column */}
          <div>
            <h3 className="text-(--accent-warm) text-sm font-medium mb-6">
              {typeof notebookLabel === "string" ? notebookLabel : ""}
            </h3>
            <ul className="space-y-3">
              {Array.isArray(notebookItems) &&
                notebookItems.map((item, index) => (
                  <li key={index}>
                    <span className="block w-full py-2.5 px-4 text-sm text-(--accent-warm) border border-(--accent-warm-alpha-50) bg-(--accent-warm-alpha-10) rounded-md font-medium">
                      {item}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
