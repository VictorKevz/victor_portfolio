import type { Locale } from "@/lib/i18n/config";
import type { UserData } from "./types";

import HeroSection from "./HeroSection";
import PhilosophySection from "./PhilosophySection";
import VideoExperiencesSection from "./VideoExperiencesSection";
import ComparisonSection from "./ComparisonSection";
import ClubHeliosSection from "./ClubHeliosSection";
import StepInForm from "./StepInForm";

interface MiniCourseContentProps {
  locale: Locale;
  user: UserData | null;
}

export default function MiniCourseContent({ locale, user }: MiniCourseContentProps) {
  return (
    <div className="space-y-16 sm:space-y-24">
      <HeroSection locale={locale} />
      <PhilosophySection locale={locale} />
      <VideoExperiencesSection locale={locale} />
      <ComparisonSection locale={locale} />
      <ClubHeliosSection locale={locale} />
      <StepInForm locale={locale} userEmail={user?.email} />
    </div>
  );
}

