import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GradientIcon } from "@/components/ui/GradientIcon";

interface SkillsSectionProps {
  locale: Locale;
}

export default function SkillsSection({ locale }: SkillsSectionProps) {
  const skills = getTranslation(locale, "skills_section") as {
    label: string;
    title: string;
    categories: Array<{
      id: string;
      label: string;
      items: string[];
    }>;
  };
  const gradients = ["gradient-primary", "gradient-secondary"] as const;

  return (
    <section
      id="skills"
      className="w-full text-on-primary relative"
      aria-labelledby="skills-title"
      style={{ background: "var(--dark-gradient)" }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <header className="text-center max-w-2xl mx-auto">
          <SectionLabel text={skills.label} variant="dark" />
          <h2
            id="skills-title"
            className="mt-4 text-3xl sm:text-4xl lg:text-6xl font-semibold uppercase heading-text-light"
          >
            {skills.title}
          </h2>
        </header>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.categories.map((category, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <li
                key={category.id}
                className="rounded-3xl border border-(--neutral-0)/25 bg-(--dark-background)/30 p-5"
              >
                <div className="flex items-center gap-3">
                  <GradientIcon
                    imageSrc={`/skills/${category.id}.png`}
                    gradient={gradient}
                    alt={category.label}
                  />
                  <p className="text-sm uppercase tracking-[0.25em] text-(--body-text-light) font-semibold">
                    {category.label}
                  </p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item}>
                      <span
                        className="rounded-full p-px flex items-center justify-center opacity-70"
                        style={{ background: `var(--${gradient})` }}
                      >
                        <span className="rounded-full bg-(--navy-1000) px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-(--body-text-light) opacity-100!">
                          {item}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
