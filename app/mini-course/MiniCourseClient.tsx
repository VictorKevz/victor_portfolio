"use client";

import type { Locale } from "@/lib/i18n/config";
import { AuthWrapper, MiniCourseContent } from "@/components/mini-course";

interface MiniCourseClientProps {
  token: string | null;
  locale: Locale;
}

export default function MiniCourseClient({ token, locale }: MiniCourseClientProps) {
  return (
    <AuthWrapper token={token} locale={locale}>
      {(user) => <MiniCourseContent locale={locale} user={user} />}
    </AuthWrapper>
  );
}

