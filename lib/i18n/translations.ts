import type { Locale } from "./config";
import en from "@/app/locales/en.json";
import fi from "@/app/locales/fi.json";

export const translations = {
  en,
  fi,
} as const;

export type TranslationValue = string | string[] | Record<string, unknown> | Array<unknown>;

export function getTranslation(locale: Locale, key: string): TranslationValue {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, val]) => result.replaceAll(`{{${key}}}`, val),
    template
  );
}
