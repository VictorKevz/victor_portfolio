"use client";

import { useState } from "react";
import Image from "next/image";
import CheckIcon from "@mui/icons-material/Check";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";

interface StepInFormProps {
  locale: Locale;
  userEmail?: string;
}

export default function StepInForm({ locale, userEmail }: StepInFormProps) {
  const heading = getTranslation(locale, "miniCourse.stepIn.heading");
  const emailPlaceholder = getTranslation(locale, "miniCourse.stepIn.emailPlaceholder");
  const submit = getTranslation(locale, "miniCourse.stepIn.submit");
  const privacy = getTranslation(locale, "miniCourse.stepIn.privacy");
  const successMsg = getTranslation(locale, "miniCourse.stepIn.success");

  const [email, setEmail] = useState(userEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/mini-course/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 text-center">
      {/* Club Helios Logo */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-6 relative rounded-full" style={{ 
        boxShadow: '0 0 20px 5px color-mix(in srgb, var(--accent-warm) 50%, transparent), 0 0 40px 10px color-mix(in srgb, var(--accent-warm) 25%, transparent)' 
      }}>
        <Image
          src="/club-helios-logo.webp"
          alt="Club Helios"
          fill
          className="object-contain"
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-(--text-hero) mb-8">
        {typeof heading === "string" ? heading : ""}
      </h2>

      {isSuccess ? (
        <div className="max-w-md mx-auto p-6 bg-(--accent-green-alpha-10) border border-(--accent-green-alpha-20) rounded-lg">
          <CheckIcon className="w-8 h-8 text-(--accent-green) mx-auto mb-2" />
          <p className="text-(--text-hero)">
            {typeof successMsg === "string" ? successMsg : "Success!"}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="founder-email" className="sr-only">
              Email
            </label>
            <input
              id="founder-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={typeof emailPlaceholder === "string" ? emailPlaceholder : "Email"}
              required
              className="w-full px-4 py-3 bg-(--background) border border-(--border) rounded-lg text-(--text-body) placeholder:text-(--text-subtle) focus:border-(--accent-warm) focus:outline-none focus:ring-2 focus:ring-(--accent-warm-alpha-20)"
            />
          </div>

          {error && (
            <p className="text-(--error) text-sm" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-(--accent-warm) text-(--background) rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader-spin w-4 h-4" />
                <span>...</span>
              </span>
            ) : typeof submit === "string" ? (
              submit
            ) : (
              "Submit"
            )}
          </button>

          <p className="text-(--text-subtle) text-xs">
            {typeof privacy === "string" ? privacy : ""}
          </p>
        </form>
      )}
    </section>
  );
}

