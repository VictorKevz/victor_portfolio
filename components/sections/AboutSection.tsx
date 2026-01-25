import type { Locale } from "@/lib/i18n/config";

interface AboutSectionProps {
  locale: Locale;
}

export default function AboutSection({ locale }: AboutSectionProps) {
  void locale;
  return null;
}
