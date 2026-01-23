import { Suspense } from "react";
import type { Locale } from "@/lib/i18n/config";
import MiniCourseClient from "./MiniCourseClient";

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="loader-spin w-8 h-8 text-(--accent-warm) mb-4" />
      <p className="text-(--text-body)">Loading...</p>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ ref?: string; lang?: string }>;
}

export default async function MiniCoursePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.ref || null;
  const locale: Locale = params.lang === "fi" ? "fi" : "en";

  return (
    <Suspense fallback={<LoadingFallback />}>
      <MiniCourseClient token={token} locale={locale} />
    </Suspense>
  );
}
