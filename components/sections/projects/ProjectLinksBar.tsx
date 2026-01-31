import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from "@mui/icons-material/Article";
import type { ProjectsLabels, ProjectLinks } from "./types";

interface ProjectLinksBarProps {
  labels: ProjectsLabels;
  links: ProjectLinks;
}

type LinkVariant = "primary" | "secondary" | "neutral";

interface ProjectLinkButtonProps {
  href?: string | null;
  label: string;
  Icon: typeof ArticleIcon;
  variant: LinkVariant;
}

function ProjectLinkButton({
  href,
  label,
  Icon,
  variant,
}: ProjectLinkButtonProps) {
  if (!href) {
    return null;
  }

  const isExternal = href.startsWith("http");
  const baseProps = {
    href,
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener noreferrer" : undefined,
  };

  if (variant === "secondary") {
    return (
      <a
        {...baseProps}
        className="inline-flex min-w-max rounded-full p-px transition-all duration-200 w-full sm:w-auto bg-gradient-secondary hover:-translate-y-px"
      >
        <span className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.6rem] uppercase tracking-[0.2em] font-semibold w-full bg-(--neutral-0) text-(--navy-900)">
          <Icon className="text-base" />
          <span>{label}</span>
        </span>
      </a>
    );
  }

  const buttonClass =
    variant === "primary"
      ? "bg-gradient-primary text-on-primary"
      : "border border-(--border-dark) bg-(--neutral-0)/90 heading-text-dark";

  return (
    <a
      {...baseProps}
      className={`inline-flex items-center justify-center gap-2 min-w-max rounded-full px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] transition-all duration-200 w-full sm:w-auto hover:-translate-y-px hover:shadow-md ${buttonClass}`}
    >
      <Icon className="text-base" />
      <span>{label}</span>
    </a>
  );
}

export function ProjectLinksBar({ labels, links }: ProjectLinksBarProps) {
  const leftLinks = [
    {
      key: "github",
      label: labels.github,
      href: links.github,
      Icon: GitHubIcon,
      variant: "neutral" as const,
    },
    {
      key: "live_site",
      label: labels.liveSite,
      href: links.live_site,
      Icon: LaunchIcon,
      variant: "primary" as const,
    },
  ];
  const caseStudyLink = {
    key: "case_study",
    label: links.case_study_label || labels.caseStudy,
    href: links.case_study,
    Icon: ArticleIcon,
    variant: "secondary" as const,
  };

  return (
    <div className="mt-12 rounded-3xl sm:rounded-full border border-(--border-dark) bg-(--neutral-0)/80 px-4 py-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:flex-wrap">
        {leftLinks.map(({ key, label, href, Icon, variant }) => (
          <ProjectLinkButton
            key={key}
            href={href}
            label={label}
            Icon={Icon}
            variant={variant}
          />
        ))}
      </div>
      <ProjectLinkButton
        key={caseStudyLink.key}
        href={caseStudyLink.href}
        label={caseStudyLink.label}
        Icon={caseStudyLink.Icon}
        variant={caseStudyLink.variant}
      />
    </div>
  );
}
