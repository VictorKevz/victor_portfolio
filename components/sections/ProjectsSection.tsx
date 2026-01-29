import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import ProjectsListClient from "./ProjectsListClient";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ProjectsSectionProps {
  locale: Locale;
}

export default function ProjectsSection({ locale }: ProjectsSectionProps) {
  const projectsSection = getTranslation(locale, "projects_section") as {
    label: string;
    title: string;
    description: string;
    theme: string;
    background: string;
    labels: {
      techStack: string;
      results: string;
      performance: string;
      accessibility: string;
      bestPractices: string;
      seo: string;
      otherMetrics: string;
      caseStudy: string;
      github: string;
      liveSite: string;
      carouselPrev: string;
      carouselNext: string;
      imagePlaceholder: string;
      showMore: string;
      showLess: string;
    };
    projects: Array<{
      id: string;
      project_name: string;
      project_title: string;
      description: string;
      images: Array<{ src: string; alt: string }>;
      tech_stack: string[];
      results: {
        performance_lighthouse: string | null;
        accessibility_lighthouse: string | null;
        best_practices_lighthouse: string | null;
        seo_lighthouse: string | null;
        other_metrics: string[];
      };
      links: {
        case_study?: string;
        github?: string;
        live_site?: string;
      };
    }>;
  };

  return (
    <section
      id="projects"
      className="w-full text-on-primary bg-(--neutral-100)"
      aria-labelledby="projects-title"
      // style={{ background: "var(--secondary-light-gradient)" }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="text-center max-w-2xl mx-auto">
          <SectionLabel text={projectsSection.label} />
          <h2
            id="projects-title"
            className="mt-4 outline-text-dark text-3xl sm:text-4xl lg:text-7xl font-semibold uppercase whitespace-nowrap"
          >
            {projectsSection.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg xl:text-xl body-text-dark">
            {projectsSection.description}
          </p>
        </header>
        <ProjectsListClient
          projects={projectsSection.projects}
          labels={projectsSection.labels}
          sectionId="projects"
        />
      </div>
    </section>
  );
}
