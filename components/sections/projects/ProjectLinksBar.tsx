import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from "@mui/icons-material/Article";
import type { ProjectsLabels, ProjectLinks } from "./types";

interface ProjectLinksBarProps {
  labels: ProjectsLabels;
  links: ProjectLinks;
}

export function ProjectLinksBar({ labels, links }: ProjectLinksBarProps) {
  const leftLinks = [
    {
      key: "github",
      label: labels.github,
      href: links.github,
      Icon: GitHubIcon,
    },
    {
      key: "live_site",
      label: labels.liveSite,
      href: links.live_site,
      Icon: LaunchIcon,
    },
  ];
  const caseStudyLink = {
    key: "case_study",
    label: labels.caseStudy,
    href: links.case_study,
    Icon: ArticleIcon,
  };

  return (
    <div className="mt-8 rounded-3xl sm:rounded-full border border-(--border-dark) bg-(--neutral-0)/80 px-4 py-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:flex-wrap">
        {leftLinks.map(({ key, label, href, Icon }) => {
          const isEnabled = Boolean(href);
          const isLiveSite = key === "live_site";
          return (
            <a
              key={key}
              href={href || "#"}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-disabled={!isEnabled}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] transition-all duration-200 w-full sm:w-auto ${
                isLiveSite
                  ? "bg-gradient-primary text-on-primary"
                  : "border border-(--border-dark) bg-(--neutral-0)/90 heading-text-dark"
              } ${
                isEnabled
                  ? "hover:-translate-y-px hover:shadow-md"
                  : "opacity-60 pointer-events-none"
              }`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </a>
          );
        })}
      </div>
      <a
        key={caseStudyLink.key}
        href={caseStudyLink.href || "#"}
        target={caseStudyLink.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          caseStudyLink.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        aria-disabled={!caseStudyLink.href}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.6rem] uppercase tracking-[0.2em] font-semibold transition-all duration-200 w-full sm:w-auto ${
          caseStudyLink.href
            ? "bg-gradient-primary text-on-primary hover:-translate-y-px"
            : "bg-(--neutral-0)/90 text-(--navy-900) border border-(--border-dark) opacity-60 pointer-events-none"
        }`}
      >
        <caseStudyLink.Icon className="text-base" />
        <span>{caseStudyLink.label}</span>
      </a>
    </div>
  );
}
