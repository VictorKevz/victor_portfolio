import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface TestimonialsSectionProps {
  locale: Locale;
}

export default function TestimonialsSection({
  locale,
}: TestimonialsSectionProps) {
  const testimonials = getTranslation(locale, "testimonials") as {
    label: string;
    title: string;
    description: string;
    items: Array<{
      name: string;
      role: string;
      linkedinUrl: string;
      quote: string;
    }>;
  };

  const testimonialIcons: Record<
    string,
    {
      Icon: React.ElementType;
      gradient: "gradient-primary" | "gradient-secondary";
    }
  > = {
    "David Findlay": { Icon: BusinessCenterIcon, gradient: "gradient-primary" },
    "Dr. Dorina Rajanen": {
      Icon: SchoolIcon,
      gradient: "gradient-secondary",
    },
    "Anjalee Wanigarathne": {
      Icon: DesignServicesIcon,
      gradient: "gradient-primary",
    },
  };

  return (
    <section
      id="recommendations"
      className="w-full text-on-primary bg-(--neutral-100)"
      aria-labelledby="recommendations-title"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10">
        <header className="text-center max-w-2xl mx-auto">
          <SectionLabel text={testimonials.label} />
          <h2
            id="recommendations-title"
            className="mt-4 outline-text-dark text-3xl sm:text-4xl lg:text-7xl font-semibold uppercase"
          >
            {testimonials.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg xl:text-xl body-text-dark">
            {testimonials.description}
          </p>
        </header>

        <ul className="mt-16 grid gap-6 lg:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.items.map((item) => {
            const meta = testimonialIcons[item.name] ?? {
              Icon: BusinessCenterIcon,
              gradient: "gradient-primary",
            };
            const nameClass =
              meta.gradient === "gradient-secondary"
                ? "text-gradient-secondary"
                : "text-gradient";
            const starColor =
              meta.gradient === "gradient-secondary"
                ? "var(--gradient-secondary-left)"
                : "var(--gradient-primary-left)";

            return (
              <li key={item.name} className="h-full">
                <div
                  className="rounded-[2.75rem] p-px h-full"
                  style={{ background: `var(--${meta.gradient})` }}
                >
                  <article className="rounded-[2.7rem] bg-(--neutral-0)/95 border border-(--border-dark) p-6 pb-7 h-full shadow-2xl shadow-yellow-500/10 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <GradientIcon
                        Icon={meta.Icon as React.ElementType}
                        gradient={meta.gradient}
                      />
                      <FormatQuoteIcon
                        className="text-2xl! heading-text-dark opacity-40"
                        fontSize="inherit"
                      />
                    </div>
                    <blockquote className="mt-6 text-sm sm:text-base body-text-dark leading-relaxed italic flex-1">
                      “{item.quote}”
                    </blockquote>
                    <div className="mt-6 h-px bg-(--border-dark)/60" />
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3
                          className={`text-sm font-semibold uppercase tracking-[0.14em] ${nameClass}`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-[0.65rem] uppercase tracking-[0.3em] heading-text-dark">
                          {item.role}
                        </p>
                        {item.linkedinUrl ? (
                          <a
                            href={item.linkedinUrl}
                            aria-label={`${item.name} on LinkedIn`}
                            className="inline-flex mt-1 transition-colors"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <LinkedInIcon
                              fontSize="medium"
                              className="hover:text-(--navy-900) hover:-translate-y-px transition-all duration-200 hover:scale-105"
                            />
                          </a>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-0.5 text-sm!">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={`${item.name}-star-${index}`}
                            fontSize="inherit"
                            style={{ color: starColor }}
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
