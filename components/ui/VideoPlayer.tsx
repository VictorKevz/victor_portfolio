"use client";

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import PlayArrow from "@mui/icons-material/PlayArrow";

interface VideoPlayerProps {
  src: string;
  poster: string;
  alt: string;
}

export function VideoPlayer({ src, poster, alt }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [userClicked, setUserClicked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle play when video becomes ready after user click
  useEffect(() => {
    if (userClicked && videoReady && videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Video play failed:", err);
          // On mobile, if autoplay fails, show controls so user can tap again
          setIsPlaying(false);
        });
    }
  }, [userClicked, videoReady]);

  const handlePlayClick = () => {
    setUserClicked(true);
    // Try to play immediately if video is already loaded
    if (videoRef.current && videoRef.current.readyState >= 3) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Immediate play failed:", err);
        });
    }
  };

  const handleCanPlayThrough = () => {
    setVideoReady(true);
  };

  const handleLoadedData = () => {
    // Also try on loadeddata for faster response
    if (userClicked && videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Will retry on canplaythrough
        });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[70vh] lg:h-[90vh] 2xl:h-[70vh] rounded-2xl overflow-hidden shadow-2xl shadow-(--overlay-10)">
      {/* Poster image - shown until user clicks */}
      {!userClicked && (
        <NextImage
          src={poster}
          alt={alt}
          fill
          className="object-cover rounded-2xl"
          priority
        />
      )}

      {/* Video element - always in DOM after click for mobile compatibility */}
      <video
        ref={videoRef}
        src={src}
        preload={userClicked ? "auto" : "none"}
        className={`w-full h-full object-cover rounded-2xl ${userClicked ? "block" : "hidden"}`}
        aria-label={alt}
        playsInline
        webkit-playsinline="true"
        controls={userClicked}
        controlsList="nodownload"
        onCanPlayThrough={handleCanPlayThrough}
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 h-full w-full flex items-center justify-center bg-(--video-overlay) hover:bg-(--video-overlay-hover) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent-warm focus-visible:outline-offset-2 rounded-2xl"
          aria-label="Play video"
        >
          <span className="w-20 h-20 rounded-xl backdrop-blur-xl backdrop-brightness-55 border border-(--border-alpha-30) flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
            <PlayArrow
              className="text-(--background) text-(--accent-warm)"
              aria-hidden="true"
              fontSize="large"
            />
          </span>
        </button>
      )}
    </div>
  );
}
