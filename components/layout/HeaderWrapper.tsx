"use client";

import { Header } from "./Header";
import type { Locale } from "@/lib/i18n/config";

interface HeaderWrapperProps {
  locale: Locale;
}

export function HeaderWrapper({ locale }: HeaderWrapperProps) {
  return <Header locale={locale} />;
}

