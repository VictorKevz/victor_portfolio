"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageCarousel } from "@/components/sections/projects/ImageCarousel";
import { ProjectLinksBar } from "@/components/sections/projects/ProjectLinksBar";
import { ResultsBlock } from "@/components/sections/projects/ResultsBlock";
import { GradientText } from "@/components/ui/GradientText";
import type { ProjectsLabels, ProjectItem, SlideItem } from "./projects/types";

interface ProjectsListClientProps {
  projects: ProjectItem[];
  labels: ProjectsLabels;
  sectionId: string;
}

function buildSlides(
  media: ProjectItem["media"],
  placeholderLabel: string,
): SlideItem[] {
  if (media.length > 0) {
    return media.map((item) => ({ ...item, isPlaceholder: false }));
  }
  return Array.from({ length: 4 }, (_, index) => ({
    type: "image",
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeSlides, setActiveSlides] = useState<Record<number, number>>({});
  const [slideDirections, setSlideDirections] = useState<
    Record<number, 1 | -1>
  >({});
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const activeSlidesRef = useRef(activeSlides);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getNextSlide = (
    current: number,
    direction: 1 | -1,
    total: number,
  ) => {
    if (total <= 1) {
      return { next: current, nextDirection: 1 as const };
    }
    if (direction === 1 && current >= total - 1) {
      return { next: current - 1, nextDirection: -1 as const };
    }
    if (direction === -1 && current <= 0) {
      return { next: current + 1, nextDirection: 1 as const };
    }
    return { next: current + direction, nextDirection: direction };
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    activeSlidesRef.current = activeSlides;
  }, [activeSlides]);

  const filteredProjects = useMemo(
    () => projects.filter((project) => !project.isHidden),
    [projects],
  );

  useEffect(() => {
    if (filteredProjects.length === 0 || prefersReducedMotion) {
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
      const currentSlides = activeSlidesRef.current;
      setSlideDirections((prevDirections) => {
        const nextDirections: Record<number, 1 | -1> = { ...prevDirections };
        const nextSlides: Record<number, number> = { ...currentSlides };

        filteredProjects.forEach((project, index) => {
          const slides = buildSlides(
            project.media ?? [],
            labels.imagePlaceholder,
          );
          const totalSlides = slides.length;
          const current = nextSlides[index] ?? 0;
          const direction = nextDirections[index] ?? 1;
          const currentSlide = slides[current];

          if (totalSlides <= 1) {
            nextSlides[index] = current;
            nextDirections[index] = 1;
            return;
          }

          if (!currentSlide || currentSlide.type === "video") {
            return;
          }

          const { next, nextDirection } = getNextSlide(
            current,
            direction,
            totalSlides,
          );
          nextSlides[index] = next;
          nextDirections[index] = nextDirection;
        });

        setActiveSlides(nextSlides);
        return nextDirections;
      });
    }, 4500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    filteredProjects,
    hoveredProject,
    labels.imagePlaceholder,
    prefersReducedMotion,
  ]);

  const handleSlideChange = (projectIndex: number, nextIndex: number) => {
    setActiveSlides((prev) => ({ ...prev, [projectIndex]: nextIndex }));
    setSlideDirections((prev) => ({ ...prev, [projectIndex]: 1 }));
  };

  const handleVideoEnd = (projectIndex: number, slideIndex: number) => {
    if (hoveredProject === projectIndex || prefersReducedMotion) {
      return;
    }
    const project = filteredProjects[projectIndex];
    if (!project) {
      return;
    }
    const slides = buildSlides(project.media ?? [], labels.imagePlaceholder);
    const totalSlides = slides.length;
    const current = activeSlidesRef.current[projectIndex] ?? 0;
    if (slideIndex !== current) {
      return;
    }
    const direction = slideDirections[projectIndex] ?? 1;
    const { next, nextDirection } = getNextSlide(
      current,
      direction,
      totalSlides,
    );
    setActiveSlides((prev) => ({ ...prev, [projectIndex]: next }));
    setSlideDirections((prev) => ({ ...prev, [projectIndex]: nextDirection }));
  };

  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, 3),
    [filteredProjects],
  );

  return (
    <>
      <ul className="mt-16 grid gap-10">
        {visibleProjects.map((project, projectIndex) => {
            const slides = buildSlides(
              project.media ?? [],
              labels.imagePlaceholder,
            );
            const totalSlides = slides.length;
            const activeIndex = Math.min(
              activeSlides[projectIndex] ?? 0,
              totalSlides - 1,
            );
            const baseImage = slides.find((slide) => {
              if (slide.isPlaceholder) {
                return false;
              }
              if (slide.type === "image") {
                return Boolean(slide.src);
              }
              return Boolean(slide.poster);
            });
            const baseImageSrc =
              baseImage?.type === "image" ? baseImage.src : undefined;
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
            const gradientVariant =
              projectIndex % 2 === 0 ? "primary" : "secondary";

            const shouldLoadVideo =
              hasInteracted || hoveredProject === projectIndex;

            return (
              <li key={project.id} className="h-full">
                <article className="group rounded-[2.75rem] bg-(--neutral-0)/90 border border-(--border-dark) p-6 lg:p-8 shadow-2xl shadow-yellow-500/10">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center lg:items-stretch min-w-0">
                    <div className="space-y-5 min-w-0">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] heading-text-dark">
                          {project.project_name}
                        </p>
                        <h3 className="mt-3 text-2xl sm:text-3xl font-bold">
                          <GradientText
                            text={project.project_title}
                            variant={gradientVariant}
                          />
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
                        <ResultsBlock
                          labels={labels}
                          results={project.results}
                        />
                      ) : null}
                    </div>

                    <ImageCarousel
                      slides={slides}
                      activeIndex={activeIndex}
                      baseImage={baseImageSrc}
                      labels={labels}
                      prefersReducedMotion={prefersReducedMotion}
                      shouldLoadVideo={shouldLoadVideo}
                      onPrev={() => {
                        setHasInteracted(true);
                        setActiveSlides((prev) => {
                          const current = prev[projectIndex] ?? 0;
                          const next = Math.max(current - 1, 0);
                          return { ...prev, [projectIndex]: next };
                        });
                        setSlideDirections((prev) => ({
                          ...prev,
                          [projectIndex]: -1,
                        }));
                      }}
                      onNext={() => {
                        setHasInteracted(true);
                        setActiveSlides((prev) => {
                          const current = prev[projectIndex] ?? 0;
                          const next = Math.min(current + 1, totalSlides - 1);
                          return { ...prev, [projectIndex]: next };
                        });
                        setSlideDirections((prev) => ({
                          ...prev,
                          [projectIndex]: 1,
                        }));
                      }}
                      onDot={(index: number) => {
                        setHasInteracted(true);
                        handleSlideChange(projectIndex, index);
                      }}
                      onHoverStart={() => {
                        setHasInteracted(true);
                        setHoveredProject(projectIndex);
                      }}
                      onHoverEnd={() => setHoveredProject(null)}
                      onVideoEnd={(slideIndex: number) =>
                        handleVideoEnd(projectIndex, slideIndex)
                      }
                    />
                  </div>
                  <ProjectLinksBar labels={labels} links={project.links} />
                </article>
              </li>
            );
          })}
      </ul>
    </>
  );
}
