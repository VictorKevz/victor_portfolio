import type { Locale } from "@/lib/i18n/config";
import { getTranslation, interpolate } from "@/lib/i18n/translations";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Logo } from "@/components/ui/Logo";
import { GradientIcon } from "@/components/ui/GradientIcon";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = getTranslation(locale, "site.name");
  const footer = getTranslation(locale, "footer") as {
    links: {
      github: { label: string; url: string };
      linkedin: { label: string; url: string };
      whatsapp: { label: string; url: string };
      email: { label: string; url: string };
    };
    copyright: string;
  };
  const copyText = interpolate(footer.copyright, {
    year: `${currentYear}`,
  });
  const socialLinks = [
    { key: "linkedin", Icon: LinkedInIcon, ...footer.links.linkedin },
    { key: "whatsapp", Icon: WhatsAppIcon, ...footer.links.whatsapp },
    { key: "github", Icon: GitHubIcon, ...footer.links.github },
    { key: "email", Icon: EmailIcon, ...footer.links.email },
  ];

  return (
    <footer className="w-full border-t border-(--border-dark)">
      <div className="w-full" style={{ background: "var(--dark-gradient)" }}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo
              label={
                typeof siteName === "string" ? siteName : "Victor Kuwandira"
              }
              showLabel
              className="gap-3"
              iconClassName="w-12 h-12"
              labelClassName="text-lg uppercase"
            />
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map((link, index) => {
                const isExternal = link.url.startsWith("http");
                return (
                  <a
                    key={link.key}
                    href={link.url}
                    aria-label={link.label}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="transition hover:-translate-y-px"
                  >
                    <GradientIcon
                      Icon={link.Icon}
                      gradient={
                        index % 2 === 0
                          ? "gradient-primary"
                          : "gradient-secondary"
                      }
                    />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-8 border-t border-(--border-light) pt-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-(--body-text-light)">
              {copyText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
