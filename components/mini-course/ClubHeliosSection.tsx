import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface ClubHeliosSectionProps {
  locale: Locale;
}

function renderHighlightedText(text: string) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, i) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      const highlighted = part.slice(2, -2);
      return (
        <span key={i} className="text-(--accent-warm)">
          {highlighted}
        </span>
      );
    }
    return part;
  });
}

export default function ClubHeliosSection({ locale }: ClubHeliosSectionProps) {
  const eyebrow = getTranslation(locale, "miniCourse.clubHelios.eyebrow");
  const heading = getTranslation(locale, "miniCourse.clubHelios.heading");
  const description = getTranslation(
    locale,
    "miniCourse.clubHelios.description"
  );
  const featuresTitle = getTranslation(
    locale,
    "miniCourse.clubHelios.features.title"
  );
  const waitlist = getTranslation(locale, "miniCourse.clubHelios.waitlist");

  const features = [
    {
      title: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.0.title"
      ),
      description: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.0.description"
      ),
    },
    {
      title: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.1.title"
      ),
      description: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.1.description"
      ),
    },
    {
      title: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.2.title"
      ),
      description: getTranslation(
        locale,
        "miniCourse.clubHelios.features.items.2.description"
      ),
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-(--accent-warm) text-xs uppercase tracking-widest font-medium mb-4">
          {typeof eyebrow === "string" ? eyebrow : ""}
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--text-hero) mb-8">
          {typeof heading === "string" ? heading : ""}
        </h2>

        {/* Description */}
        <div className="space-y-1 mb-8">
          {Array.isArray(description) ? (
            description.map((line, index) =>
              line === "" ? (
                <div key={index} className="h-4" aria-hidden="true" />
              ) : (
                <p
                  key={index}
                  className="text-(--text-body) text-base leading-relaxed"
                >
                  {renderHighlightedText(line)}
                </p>
              )
            )
          ) : (
            <p className="text-(--text-body) text-base leading-relaxed">
              {renderHighlightedText(description as string)}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mb-8">
          <p className="text-(--text-body) font-medium mb-6">
            {typeof featuresTitle === "string" ? featuresTitle : ""}
          </p>
          <ul className="space-y-6">
            {features.map((feature, index) => (
              <li
                key={index}
                className="border-l-2 border-(--accent-warm) pl-4"
              >
                <p className="text-(--accent-warm) font-medium">
                  {typeof feature.title === "string" ? feature.title : ""}
                </p>
                <p className="text-(--text-subtle) text-sm mt-1">
                  {typeof feature.description === "string"
                    ? feature.description
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Waitlist Text */}
        <div className="space-y-1">
          {Array.isArray(waitlist) ? (
            waitlist.map((line, index) =>
              line === "" ? (
                <div key={index} className="h-4" aria-hidden="true" />
              ) : (
                <p
                  key={index}
                  className="text-(--text-body) text-base leading-relaxed"
                >
                  {renderHighlightedText(line)}
                </p>
              )
            )
          ) : (
            <p className="text-(--text-body) text-base leading-relaxed">
              {renderHighlightedText(waitlist as string)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
