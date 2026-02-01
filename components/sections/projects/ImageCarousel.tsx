"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";
import type { ProjectsLabels, SlideItem } from "./types";

interface ImageCarouselProps {
  slides: SlideItem[];
  activeIndex: number;
  baseImage?: string;
  fallbackPoster?: string;
  labels: ProjectsLabels;
  prefersReducedMotion: boolean;
  shouldLoadVideo: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onVideoEnd?: (index: number) => void;
}

export function ImageCarousel({
  slides,
  activeIndex,
  baseImage,
  fallbackPoster,
  labels,
  prefersReducedMotion,
  shouldLoadVideo,
  onPrev,
  onNext,
  onDot,
  onHoverStart,
  onHoverEnd,
  onVideoEnd,
}: ImageCarouselProps) {
  const totalSlides = slides.length;
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileUnlocked, setMobileUnlocked] = useState(false);

  const firstVideoIndex = useMemo(
    () => slides.findIndex((slide) => slide.type === "video"),
    [slides],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDevice = () => setIsDesktop(mediaQuery.matches);
    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);
    return () => mediaQuery.removeEventListener("change", updateDevice);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }
      if (index === activeIndex && (isDesktop || mobileUnlocked)) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, isDesktop, mobileUnlocked]);

  const transition = prefersReducedMotion
    ? ({ duration: 0 } as const)
    : ({ duration: 0.35, ease: "easeInOut" } as const);

  return (
    <div className="h-64 sm:h-96 md:h-120 lg:h-full lg:min-h-120 min-w-0">
      <div
        className="relative rounded-4xl overflow-hidden bg-(--neutral-0)/90 h-full"
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
          {slides.map((slide, index) => (
            <motion.div
              key={`${slide.src}-${index}`}
              className="absolute inset-0 h-full w-full"
              initial={false}
              animate={index === activeIndex ? { opacity: 1 } : { opacity: 0 }}
              transition={transition}
              style={{ pointerEvents: index === activeIndex ? "auto" : "none" }}
            >
              {slide.isPlaceholder ? (
                <div className="h-full w-full flex items-center justify-center bg-(--neutral-100)">
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] heading-text-dark/70">
                    {labels.imagePlaceholder}
                  </span>
                </div>
              ) : slide.type === "video" ? (
                (isDesktop && index === activeIndex) ||
                (!isDesktop && mobileUnlocked && index === activeIndex) ? (
                  <video
                    ref={(element) => {
                      videoRefs.current[index] = element;
                    }}
                    className="h-full w-full object-cover object-top lg:object-center"
                    src={slide.src}
                    poster={slide.poster || fallbackPoster}
                    muted
                    playsInline
                    autoPlay
                    preload={isDesktop ? "auto" : "metadata"}
                    aria-label={slide.alt}
                    onEnded={() => onVideoEnd?.(index)}
                  >
                    <track
                      kind="captions"
                      src="/captions/blank.vtt"
                      srcLang="en"
                      label="English"
                    />
                  </video>
                ) : (
                  <div className="relative h-full w-full bg-(--neutral-100)">
                    <Image
                      src={slide.poster || fallbackPoster || slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover object-[50%_30%] lg:object-center"
                    />
                    {!isDesktop && index === firstVideoIndex && !mobileUnlocked ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setMobileUnlocked(true)}
                          className="h-14 w-14 rounded-full bg-(--neutral-0)/90 border border-(--border-dark) flex items-center justify-center shadow-md"
                          aria-label="Play video"
                        >
                          <span className="ml-1 block h-0 w-0 border-y-[7px] border-y-transparent border-l-12 border-l-(--border-dark)" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                )
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[50%_30%] lg:object-center"
                />
              )}
            </motion.div>
          ))}
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
        <div className=" flex items-center justify-center gap-1">
          {slides.map((_, slideIndex) => (
            <button
              key={`dot-${slideIndex}`}
              type="button"
              aria-label={`Slide ${slideIndex + 1}`}
              className="h-11 w-11 -mx-3 rounded-full flex items-center justify-center"
              onClick={() => onDot(slideIndex)}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border border-(--border-dark) transition ${
                  slideIndex === activeIndex
                    ? "bg-(--border-dark)"
                    : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
