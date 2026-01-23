"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export function GoogleAnalytics() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();

  // Early return if GA ID is missing - safe for production
  if (!gaMeasurementId || gaMeasurementId.trim() === "") {
    return null;
  }

  // Track page views on route changes
  useEffect(() => {
    if (!gaMeasurementId || typeof window === "undefined" || !window.gtag) {
      return;
    }

    try {
      const url = pathname + (window.location.search || "");
      window.gtag("config", gaMeasurementId, {
        page_path: url,
      });
    } catch (error) {
      // Silently fail - analytics should not break the app
    }
  }, [pathname, gaMeasurementId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

