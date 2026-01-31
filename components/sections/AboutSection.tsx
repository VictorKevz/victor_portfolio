import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Image } from "@/components/ui/Image";
import { GradientText } from "@/components/ui/GradientText";

interface AboutSectionProps {
  locale: Locale;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  const about = getTranslation(locale, "about_section") as {
    label: string;
    title: string;
    description: string;
    imageCaption: string;
    imageSrc: string;
    items: Array<{
      id: string;
      title: string;
      period: string;
      tags?: string[];
      description: string;
    }>;
  };

  const items = about.items ?? [];

  const renderGradientText = (text: string, variant: "primary" | "secondary") =>
    text.split(/(\/[^/]+\/)/g).map((segment, index) => {
      if (segment.startsWith("/") && segment.endsWith("/")) {
        return (
          <GradientText
            key={`grad-${index}`}
            text={segment.slice(1, -1)}
            className="font-semibold italic"
            variant={variant}
          />
        );
      }
      return <span key={`txt-${index}`}>{segment}</span>;
    });

  return (
    <section
      id="about"
      className="w-full text-on-primary bg-(--neutral-100)"
      aria-labelledby="about-title"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center max-w-2xl mx-auto">
          <SectionLabel text={about.label} />
          <h2
            id="about-title"
            className="mt-4 outline-text-dark text-3xl sm:text-4xl lg:text-7xl font-semibold uppercase"
          >
            {about.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg xl:text-xl body-text-dark">
            {about.description}
          </p>
        </header>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start">
          {/* Static image on the left */}
          {/* Import the correct Image component at the top if not already imported */}
          <div className="relative rounded-[3rem] border border-(--border-dark) bg-(--neutral-0)/90 p-4 overflow-hidden lg:sticky lg:top-24">
            <figure className="relative aspect-4/5 rounded-[2.2rem] overflow-hidden ">
              <Image
                src={about.imageSrc}
                alt={about.title}
                className="h-full w-full object-cover object-[50%_20%]"
                loading="lazy"
                priority
                width={800}
                height={420}
              />
              <figcaption className="absolute bottom-0 w-full rounded-b-[2.2rem] bg-(--neutral-100)/75 backdrop-blur-[2px] px-4 py-5 text-center text-xs uppercase italic font-semibold heading-text-dark z-10">
                {about.imageCaption}
              </figcaption>
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none inset-0 opacity-45"
                style={{ background: "var(--dark-gradient)" }}
              />
            </figure>
          </div>

          {/* Timeline on the right */}
          <ol className="relative border-l-2 border-(--border-dark) pl-8 space-y-10">
            {items.map((item, index) => {
              const gradient =
                index % 2 === 0 ? "gradient-primary" : "gradient-secondary";
              const gradientVariant = index % 2 === 0 ? "primary" : "secondary";
              return (
                <li key={item.id} className="relative">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[calc(2rem+8px)] top-1 h-3.5 w-3.5 rounded-full ${
                      gradient === "gradient-primary"
                        ? "bg-gradient-primary"
                        : "bg-gradient-secondary"
                    }`}
                  />

                  <article className="bg-(--neutral-0)/90 p-4 rounded-3xl border border-(--border-dark)">
                    <span className="inline-flex rounded-full border border-(--border-dark) px-3 py-1 text-[0.55rem] uppercase tracking-[0.3em] heading-text-dark">
                      {item.period}
                    </span>
                    <h3 className="mt-3 text-lg sm:text-xl font-semibold uppercase heading-text-dark flex items-center gap-3">
                      <Image
                        src={`/about/${item.id}.webp`}
                        alt={`${item.title} flag`}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span>{item.title}</span>
                    </h3>
                    <p className="mt-2 text-sm sm:text-base body-text-dark">
                      {renderGradientText(item.description, gradientVariant)}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <li key={tag}>
                            <span
                              className="rounded-full p-px flex items-center justify-center"
                              style={{ background: `var(--${gradient})` }}
                            >
                              <span className="rounded-full bg-(--neutral-0) px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] heading-text-dark">
                                {tag}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
