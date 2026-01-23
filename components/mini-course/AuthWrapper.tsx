"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import type { UserData, AuthState } from "./types";

interface AuthWrapperProps {
  token: string | null;
  locale: Locale;
  children: (user: UserData | null) => React.ReactNode;
}

export default function AuthWrapper({
  token,
  locale,
  children,
}: AuthWrapperProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (authState === "authenticated") {
      return;
    }

    async function verifyAccess() {
      try {
        const url = token
          ? `/api/mini-course/verify?ref=${encodeURIComponent(token)}`
          : "/api/mini-course/verify";

        const response = await fetch(url, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
          setUser(data.user);
          setAuthState("authenticated");

          if (token) {
            setTimeout(() => {
              router.replace(`/mini-course?lang=${locale}`);
            }, 100);
          }
        } else {
          setErrorMessage(data.message || "Access denied");
          setAuthState("denied");
        }
      } catch (error) {
        const msg = getTranslation(locale, "miniCourse.error.message");
        setErrorMessage(
          typeof msg === "string" ? msg : "Unable to verify access."
        );
        setAuthState("error");
      }
    }

    verifyAccess();
  }, [token, locale, router, authState]);

  if (authState === "loading") {
    const verifyingText = getTranslation(locale, "miniCourse.verifying");
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="loader-spin w-8 h-8 text-(--accent-warm) mb-4" />
        <p className="text-(--text-body)">
          {typeof verifyingText === "string"
            ? verifyingText
            : "Verifying access..."}
        </p>
      </div>
    );
  }

  if (authState === "denied" || authState === "error") {
    const titleKey =
      authState === "denied"
        ? "miniCourse.accessDenied.title"
        : "miniCourse.error.title";
    const title = getTranslation(locale, titleKey);
    const goHome = getTranslation(locale, "miniCourse.accessDenied.goHome");

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-(--error-alpha-10) flex items-center justify-center mb-6">
          {authState === "denied" ? (
            <LockIcon className="w-8 h-8 text-(--error)" />
          ) : (
            <ErrorOutlineIcon className="w-8 h-8 text-(--error)" />
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-(--text-hero) mb-4">
          {typeof title === "string" ? title : "Access Denied"}
        </h1>

        <p className="text-(--text-body) max-w-md mb-8">{errorMessage}</p>

        <Link
          href={`/${locale}`}
          className="inline-block px-6 py-3 bg-(--accent-warm) text-(--background) rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          {typeof goHome === "string" ? goHome : "Go to Homepage"}
        </Link>
      </div>
    );
  }

  return <>{children(user)}</>;
}
