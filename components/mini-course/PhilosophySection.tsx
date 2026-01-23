import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface PhilosophySectionProps {
  locale: Locale;
}

export default function PhilosophySection({ locale }: PhilosophySectionProps) {
  const eyebrow = getTranslation(locale, "miniCourse.philosophy.eyebrow");
  const heading = getTranslation(locale, "miniCourse.philosophy.heading");
  const body = getTranslation(locale, "miniCourse.philosophy.body");

  return (
    <section className="py-12 sm:py-16 bg-(--secondary) -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <p className="text-(--accent-warm) text-xs uppercase tracking-widest font-medium mb-4">
          {typeof eyebrow === "string" ? eyebrow : ""}
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--text-hero) mb-8">
          {typeof heading === "string" ? heading : ""}
        </h2>

        <div className="space-y-1">
          {Array.isArray(body) ? (
            body.map((line, index) => {
              if (line === "") {
                return <div key={index} className="h-4" aria-hidden="true" />;
              }
              
              const isHighlighted = 
                line === "What's missing is clarity." || 
                line === "Mikä todella puuttuu?";
              
              return (
                <p 
                  key={index} 
                  className={`text-base sm:text-lg leading-relaxed ${
                    isHighlighted ? "text-(--accent-warm)" : "text-(--text-body)"
                  }`}
                >
                  {line}
                </p>
              );
            })
          ) : (
            <p className="text-(--text-body) text-base sm:text-lg leading-relaxed">{body}</p>
          )}
        </div>
      </div>
    </section>
  );
}

