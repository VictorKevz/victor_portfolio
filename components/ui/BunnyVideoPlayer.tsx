"use client";

interface BunnyVideoPlayerProps {
  videoId: string;
  libraryId?: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
}

export function BunnyVideoPlayer({
  videoId,
  libraryId,
  title = "Video",
  className = "",
  autoplay = false,
  muted = false,
}: BunnyVideoPlayerProps) {
  const library = libraryId || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "";

  if (!library) {
    return (
      <div className={`aspect-video bg-(--muted) rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-(--text-subtle)">Video configuration missing</p>
      </div>
    );
  }

  const embedUrl = new URL(
    `https://iframe.mediadelivery.net/embed/${library}/${videoId}`
  );

  embedUrl.searchParams.set("autoplay", autoplay ? "true" : "false");
  embedUrl.searchParams.set("muted", muted ? "true" : "false");
  embedUrl.searchParams.set("preload", "metadata");
  embedUrl.searchParams.set("responsive", "true");

  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden border border-(--border) ${className}`}>
      <iframe
        src={embedUrl.toString()}
        title={title}
        className="absolute inset-0 w-full h-full"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function VideoPlaceholder({
  className = "",
  message = "Loading video...",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={`aspect-video bg-(--muted) rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="loader-spin mx-auto mb-2" />
        <p className="text-(--text-subtle) text-sm">{message}</p>
      </div>
    </div>
  );
}

