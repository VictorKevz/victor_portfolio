import type { Metadata } from "next";
import { Suspense } from "react";
import { MiniCourseHeader } from "@/components/layout/MiniCourseHeader";

export const metadata: Metadata = {
  title: "LLM Experience | Markku Tauriainen",
  description: "A Thinking Framework for 2026 - Notebook LLM Experience",
  robots: {
    index: false,
    follow: false,
  },
  referrer: "no-referrer",
};

export default function MiniCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--background) flex flex-col">
      {/* Header with language and theme toggles */}
      <Suspense
        fallback={
          <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-(--accent-warm-alpha-30)">
            <div className="max-w-screen-xl mx-auto">
              <span className="text-lg font-semibold text-(--foreground)">
                Markku Tauriainen
              </span>
            </div>
          </header>
        }
      >
        <MiniCourseHeader />
      </Suspense>

      <main className="flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-(--border)">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="text-sm text-(--text-subtle)">
            © 2026 Markku Tauriainen
          </p>
        </div>
      </footer>
    </div>
  );
}

