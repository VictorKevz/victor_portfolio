import type { Locale } from "@/lib/i18n/config";
import { getTranslation, interpolate } from "@/lib/i18n/translations";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyValue = getTranslation(locale, "footer.copyright");
  const copyText =
    typeof copyValue === "string"
      ? interpolate(copyValue, { year: `${currentYear}` })
      : `© ${currentYear}`;

  return (
    <footer className="w-full border-t border-(--border)">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-subtle text-sm text-center">
          {copyText}
        </p>
      </div>
    </footer>
  );
}
