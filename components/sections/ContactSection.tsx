import type { Locale } from "@/lib/i18n/config";

interface ContactSectionProps {
  locale: Locale;
}

export default function ContactSection({ locale }: ContactSectionProps) {
  void locale;
  return null;
}
