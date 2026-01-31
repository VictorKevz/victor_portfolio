import Image from "next/image";
import StorageIcon from "@mui/icons-material/Storage";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WebIcon from "@mui/icons-material/Web";
import InsightsIcon from "@mui/icons-material/Insights";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { CTALink } from "@/components/ui/CTALink";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ServicesSectionProps {
  locale: Locale;
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const services = getTranslation(locale, "services") as {
    label: string;
    title: string;
    description: string;
    imageAlt: string;
    imageCaption: string;
    ctaTitle: string;
    ctaDescription: string;
    items: Array<{ id: string; title: string; bullets: string[] }>;
  };
  const ctaLabel = getTranslation(locale, "hero.cta.secondary") as string;

  const serviceIcons: Record<
    string,
    {
      Icon: typeof StorageIcon;
      gradient: "gradient-primary" | "gradient-secondary";
    }
  > = {
    "headless-dev": { Icon: StorageIcon, gradient: "gradient-primary" },
    "ux-design": { Icon: PsychologyIcon, gradient: "gradient-secondary" },
    "web-apps": { Icon: WebIcon, gradient: "gradient-primary" },
    "digital-strategy": { Icon: InsightsIcon, gradient: "gradient-secondary" },
  };

  return (
    <section
      id="services"
      className="w-full text-on-primary bg-(--neutral-100)"
      aria-labelledby="services-title"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center max-w-2xl mx-auto">
          <SectionLabel text={services.label} />
          <h2
            id="services-title"
            className="mt-4 outline-text-dark text-3xl sm:text-4xl lg:text-7xl font-semibold  uppercase"
          >
            {services.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg xl:text-xl body-text-dark">
            {services.description}
          </p>
        </header>

        <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] items-stretch">
          <figure className="rounded-[3rem] relative overflow-hidden bg-(--neutral-0)/90 h-full border border-(--border-dark)">
            <Image
              src="/service-image.webp"
              alt={services.imageAlt}
              width={800}
              height={420}
              className="w-full h-full object-cover"
              sizes="(max-width: 1024px) 100vw, 662px"
              priority
            />
          </figure>

          <ul className="grid gap-4 sm:grid-cols-2" aria-label="Services list">
            {services.items.map((item) => (
              <li key={item.id} className="h-full">
                <article className="rounded-4xl bg-(--neutral-0)/90 p-5 border border-(--border-dark) h-full">
                  <div className="flex items-center gap-3">
                    <GradientIcon
                      Icon={serviceIcons[item.id]?.Icon ?? StorageIcon}
                      gradient={
                        serviceIcons[item.id]?.gradient ?? "gradient-primary"
                      }
                    />
                    <h3 className="text-xs uppercase font-bold heading-text-dark">
                      {item.title}
                    </h3>
                  </div>
                  <ul className="mt-3 -ml-1.5 flex flex-col gap-2">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-1 text-sm body-text-dark"
                      >
                        <ChevronRightIcon
                          className="heading-text-dark"
                          fontSize="small"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-20 flex flex-col items-center justify-center">
          <h3 className="text-2xl font-semibold heading-text-dark uppercase">
            {services.ctaTitle}
          </h3>
          <p className="mt-1 text-base body-text-dark mb-5 text-center">
            {services.ctaDescription}
          </p>
          <CTALink href="#contact" label={ctaLabel} variant="primary" />
        </div>
      </div>
    </section>
  );
}
