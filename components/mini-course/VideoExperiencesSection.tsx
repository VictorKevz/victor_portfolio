import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { VIDEO_URLS, VIDEO_THUMBNAILS } from "./types";
import VideoCard from "./VideoCard";

interface VideoExperiencesSectionProps {
  locale: Locale;
}

export default function VideoExperiencesSection({ locale }: VideoExperiencesSectionProps) {
  const eyebrow = getTranslation(locale, "miniCourse.videoSection.eyebrow");
  const heading = getTranslation(locale, "miniCourse.videoSection.heading");
  const videoComingSoon = getTranslation(locale, "miniCourse.videoComingSoon");
  const reflectionLabel = getTranslation(locale, "miniCourse.reflectionLabel");
  const publishedLabel = getTranslation(locale, "miniCourse.videoPublished");

  const getString = (value: string | string[]): string => 
    typeof value === "string" ? value : "";

  const videos = [
    {
      key: "customerFirst",
      url: VIDEO_URLS.customerFirst[locale],
      thumbnail: VIDEO_THUMBNAILS.customerFirst[locale],
      label: getString(getTranslation(locale, "miniCourse.videos.customerFirst.label")),
      title: getString(getTranslation(locale, "miniCourse.videos.customerFirst.title")),
      duration: getString(getTranslation(locale, "miniCourse.videos.customerFirst.duration")),
      description: getString(getTranslation(locale, "miniCourse.videos.customerFirst.description")),
      reflection: getString(getTranslation(locale, "miniCourse.videos.customerFirst.reflection")),
    },
    {
      key: "clarityFirst",
      url: VIDEO_URLS.clarityFirst[locale],
      thumbnail: VIDEO_THUMBNAILS.clarityFirst[locale],
      label: getString(getTranslation(locale, "miniCourse.videos.clarityFirst.label")),
      title: getString(getTranslation(locale, "miniCourse.videos.clarityFirst.title")),
      duration: getString(getTranslation(locale, "miniCourse.videos.clarityFirst.duration")),
      description: getString(getTranslation(locale, "miniCourse.videos.clarityFirst.description")),
      reflection: getString(getTranslation(locale, "miniCourse.videos.clarityFirst.reflection")),
    },
    {
      key: "valueFirst",
      url: VIDEO_URLS.valueFirst[locale],
      thumbnail: VIDEO_THUMBNAILS.valueFirst[locale],
      label: getString(getTranslation(locale, "miniCourse.videos.valueFirst.label")),
      title: getString(getTranslation(locale, "miniCourse.videos.valueFirst.title")),
      duration: getString(getTranslation(locale, "miniCourse.videos.valueFirst.duration")),
      description: getString(getTranslation(locale, "miniCourse.videos.valueFirst.description")),
      reflection: getString(getTranslation(locale, "miniCourse.videos.valueFirst.reflection")),
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-(--accent-warm) text-xs uppercase tracking-widest font-medium mb-4">
          {typeof eyebrow === "string" ? eyebrow : ""}
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--text-hero) max-w-2xl mx-auto">
          {typeof heading === "string" ? heading : ""}
        </h2>
      </div>

      <div className="space-y-8">
        {videos.map((video) => (
          <VideoCard
            key={video.key}
            video={video}
            videoComingSoon={getString(videoComingSoon)}
            reflectionLabel={getString(reflectionLabel)}
            publishedLabel={getString(publishedLabel)}
          />
        ))}
      </div>
    </section>
  );
}

