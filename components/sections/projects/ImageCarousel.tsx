"use client";

import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";
import type { ProjectsLabels, SlideItem } from "./types";

interface ImageCarouselProps {
  slides: SlideItem[];
  activeIndex: number;
  baseImage?: string;
  labels: ProjectsLabels;
  prefersReducedMotion: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export function ImageCarousel({
  slides,
  activeIndex,
  baseImage,
  labels,
  prefersReducedMotion,
  onPrev,
  onNext,
  onDot,
  onHoverStart,
  onHoverEnd,
}: ImageCarouselProps) {
  const totalSlides = slides.length;
  const trackWidth = `${totalSlides * 100}%`;
  const slideWidth = `${100 / totalSlides}%`;

  return (
    <div className="h-64 sm:h-80 lg:h-full min-w-0">
      <div
        className="relative rounded-4xl overflow-hidden border border-(--border-dark) bg-(--neutral-100) h-full"
        style={
          baseImage
            ? {
                backgroundImage: `url(${baseImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <div className="relative h-full w-full overflow-hidden">
          <motion.div
            className="flex h-full"
            style={{ width: trackWidth }}
            animate={
              prefersReducedMotion
                ? undefined
                : { x: `-${activeIndex * (100 / totalSlides)}%` }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {slides.map((slide, index) => (
              <div
                key={`${slide.src}-${index}`}
                className="relative h-full shrink-0"
                style={{ width: slideWidth }}
              >
                {slide.isPlaceholder ? (
                  <div className="h-full w-full flex items-center justify-center bg-(--neutral-100)">
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] heading-text-dark/70">
                      {labels.imagePlaceholder}
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "var(--dark-gradient)", opacity: 0.3 }}
                    />
                  </>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {totalSlides > 1 ? (
          <>
            <button
              type="button"
              aria-label={labels.carouselPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-(--border-dark) bg-(--neutral-0)/90 flex items-center justify-center transition hover:-translate-y-[52%] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              onClick={onPrev}
            >
              <ChevronLeftIcon className="heading-text-dark" />
            </button>
            <button
              type="button"
              aria-label={labels.carouselNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-(--border-dark) bg-(--neutral-0)/90 flex items-center justify-center transition hover:-translate-y-[52%] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              onClick={onNext}
            >
              <ChevronRightIcon className="heading-text-dark" />
            </button>
          </>
        ) : null}
      </div>

      {totalSlides > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_, slideIndex) => (
            <button
              key={`dot-${slideIndex}`}
              type="button"
              aria-label={`Slide ${slideIndex + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-(--border-dark) transition ${
                slideIndex === activeIndex ? "bg-(--border-dark)" : "bg-transparent"
              }`}
              onClick={() => onDot(slideIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
