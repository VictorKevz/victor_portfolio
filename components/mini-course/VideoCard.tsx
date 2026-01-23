"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { VideoData } from "./types";

interface VideoCardProps {
  video: VideoData;
  videoComingSoon: string;
  reflectionLabel: string;
  publishedLabel: string;
}

export default function VideoCard({ video, videoComingSoon, reflectionLabel, publishedLabel }: VideoCardProps) {
  const [userClicked, setUserClicked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setUserClicked(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Video play failed - user can use controls to retry
        });
      }
    }, 100);
  };

  return (
    <div className="bg-(--secondary) rounded-xl p-6 sm:p-8">
      {/* Card Header */}
      <div className="mb-4">
        <p className="text-(--text-subtle) text-xs uppercase tracking-wider mb-1">
          {video.label}
        </p>
        <h3 className="text-xl sm:text-2xl font-bold text-(--text-hero) mb-2">
          {video.title}
        </h3>
        {video.url ? (
          <div className="flex items-center gap-2 text-(--accent-green) text-sm">
            <span className="w-2 h-2 rounded-full bg-(--accent-green)" aria-hidden="true" />
            <span>{publishedLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-(--accent-warm) text-sm">
            <span className="w-2 h-2 rounded-full bg-(--accent-warm)" aria-hidden="true" />
            <span>{videoComingSoon}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-(--text-body) text-sm sm:text-base mb-6">
        {video.description}
      </p>

      {/* Video Player */}
      <div className="relative aspect-video bg-(--background) rounded-lg overflow-hidden mb-6 w-full">
        {video.url ? (
          <>
            {/* Single video element - always in DOM */}
            <video
              ref={videoRef}
              src={video.url}
              className={`w-full h-full object-contain ${userClicked ? "block" : "hidden"}`}
              controls={userClicked}
              controlsList="nodownload"
              preload="none"
              playsInline
              webkit-playsinline="true"
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Show thumbnail and play button before user clicks */}
            {!userClicked && (
              <>
                {video.thumbnail && (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <button
                  onClick={handlePlayClick}
                  className="absolute inset-0 flex items-center justify-center bg-(--video-overlay) hover:bg-(--video-overlay-hover) transition-colors z-10"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-(--accent-warm) flex items-center justify-center">
                    <PlayArrowIcon className="w-8 h-8 sm:w-10 sm:h-10 text-(--background) ml-1" />
                  </div>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-(--border) flex items-center justify-center mb-3">
              <PlayArrowIcon className="w-6 h-6 text-(--text-subtle)" />
            </div>
            <p className="text-(--text-subtle) text-sm">{videoComingSoon}</p>
          </div>
        )}
      </div>

      {/* Reflection Question */}
      <div className="border-t border-(--border) pt-4">
        <p className="text-(--accent-warm) text-xs uppercase tracking-wider font-medium mb-2">
          {reflectionLabel}
        </p>
        <p className="text-(--text-body) text-sm sm:text-base italic">
          {video.reflection}
        </p>
      </div>
    </div>
  );
}
