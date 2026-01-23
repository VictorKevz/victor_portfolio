import { siteConfig } from "@/config/site.config";

export type Locale = "fi" | "en";

export const locales: Locale[] = siteConfig.site.locales;
export const defaultLocale: Locale = siteConfig.site.defaultLocale;

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return null;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (isValidLocale(firstSegment)) {
    return "/" + segments.slice(1).join("/");
  }

  return pathname;
}
