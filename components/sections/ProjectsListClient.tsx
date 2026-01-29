"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageCarousel } from "./projects/ImageCarousel";
import { ProjectLinksBar } from "./projects/ProjectLinksBar";
import { ResultsBlock } from "./projects/ResultsBlock";
import type {
  ProjectsLabels,
  ProjectItem,
  SlideItem,
} from "./projects/types";

interface ProjectsListClientProps {
  projects: ProjectItem[];
  labels: ProjectsLabels;
  sectionId: string;
}

function buildSlides(images: ProjectItem["images"], placeholderLabel: string): SlideItem[] {
  if (images.length > 0) {
    return images.map((image) => ({ ...image, isPlaceholder: false }));
  }
  return Array.from({ length: 4 }, (_, index) => ({
    src: `placeholder-${index + 1}`,
    alt: placeholderLabel,
    isPlaceholder: true,
  }));
}

export default function ProjectsListClient({
  projects,
  labels,
  sectionId,
}: ProjectsListClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);
  const [activeSlides, setActiveSlides] = useState<Record<number, number>>({});
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const prevShowAllRef = useRef(showAllProjects);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (projects.length === 0 || prefersReducedMotion) {
      return;
    }

    if (hoveredProject !== null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveSlides((prev) => {
        const nextState: Record<number, number> = { ...prev };
        projects.forEach((project, index) => {
          const slides = buildSlides(project.images ?? [], labels.imagePlaceholder);
          const totalSlides = slides.length;
          const current = nextState[index] ?? 0;
          nextState[index] = (current + 1) % totalSlides;
        });
        return nextState;
      });
    }, 4500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hoveredProject, labels.imagePlaceholder, prefersReducedMotion, projects]);

  useEffect(() => {
    const wasExpanded = prevShowAllRef.current;
    prevShowAllRef.current = showAllProjects;
    if (!wasExpanded || showAllProjects) {
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - 24;
    const duration = 900;
    const startY = window.scrollY;
    const distance = top - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + distance * easeOut);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const handle = window.setTimeout(() => {
      window.requestAnimationFrame(step);
    }, 80);

    return () => window.clearTimeout(handle);
  }, [sectionId, showAllProjects]);

  const handleSlideChange = (projectIndex: number, nextIndex: number) => {
    setActiveSlides((prev) => ({ ...prev, [projectIndex]: nextIndex }));
  };

  const visibleProjects = useMemo(
    () => (showAllProjects ? projects : projects.slice(0, 2)),
    [projects, showAllProjects],
  );

  const springTransition = { type: "spring", stiffness: 180, damping: 22 } as const;
  const reducedTransition = { duration: 0 } as const;
  const layoutTransition = prefersReducedMotion ? reducedTransition : springTransition;

  return (
    <>
      <motion.ul
        layout={!shouldReduceMotion}
        transition={layoutTransition}
        className="mt-16 grid gap-10"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visibleProjects.map((project, projectIndex) => {
            const slides = buildSlides(project.images ?? [], labels.imagePlaceholder);
            const totalSlides = slides.length;
            const activeIndex = Math.min(
              activeSlides[projectIndex] ?? 0,
              totalSlides - 1,
            );
            const baseImage = slides.find((slide) => !slide.isPlaceholder)?.src;
            const performance = project.results.performance_lighthouse;
            const accessibility = project.results.accessibility_lighthouse;
            const bestPractices = project.results.best_practices_lighthouse;
            const seo = project.results.seo_lighthouse;
            const otherMetrics = project.results.other_metrics ?? [];
            const hasResults =
              Boolean(performance) ||
              Boolean(accessibility) ||
              Boolean(bestPractices) ||
              Boolean(seo) ||
              otherMetrics.length > 0;
            return (
              <motion.li
                key={project.id}
                layout={!shouldReduceMotion}
                transition={layoutTransition}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -24 }}
                className="h-full"
              >
                <article className="group rounded-[2.75rem] bg-(--neutral-0)/90 border border-(--border-dark) p-6 lg:p-8 shadow-2xl shadow-yellow-500/10">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center lg:items-stretch min-w-0">
                    <div className="space-y-5 min-w-0">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] heading-text-dark">
                          {project.project_name}
                        </p>
                        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold heading-text-dark">
                          {project.project_title}
                        </h3>
                        <p className="mt-3 text-base body-text-dark leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] font-semibold heading-text-dark">
                          {labels.techStack}
                        </h4>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {project.tech_stack.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-full border border-(--border-dark) px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] heading-text-dark"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {hasResults ? (
                        <ResultsBlock labels={labels} results={project.results} />
                      ) : null}
                    </div>

                    <ImageCarousel
                      slides={slides}
                      activeIndex={activeIndex}
                      baseImage={baseImage}
                      labels={labels}
                      prefersReducedMotion={shouldReduceMotion}
                      onPrev={() => {
                        setActiveSlides((prev) => {
                          const current = prev[projectIndex] ?? 0;
                          const next = (current - 1 + totalSlides) % totalSlides;
                          return { ...prev, [projectIndex]: next };
                        });
                      }}
                      onNext={() => {
                        setActiveSlides((prev) => {
                          const current = prev[projectIndex] ?? 0;
                          const next = (current + 1) % totalSlides;
                          return { ...prev, [projectIndex]: next };
                        });
                      }}
                      onDot={(index) => handleSlideChange(projectIndex, index)}
                      onHoverStart={() => setHoveredProject(projectIndex)}
                      onHoverEnd={() => setHoveredProject(null)}
                    />
                  </div>
                  <ProjectLinksBar labels={labels} links={project.links} />
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {projects.length > 2 ? (
        <div className="mt-12 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowAllProjects((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-(--border-dark) bg-(--neutral-0)/90 px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] heading-text-dark transition-all duration-200 hover:-translate-y-px hover:shadow-md"
          >
            {showAllProjects ? labels.showLess : labels.showMore}
          </button>
        </div>
      ) : null}
    </>
  );
}
