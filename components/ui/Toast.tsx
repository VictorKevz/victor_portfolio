"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 8000 }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const animationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (isPaused) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = remainingTimeRef.current - elapsed;
    const newProgress = (remaining / duration) * 100;

    if (newProgress <= 0) {
      onClose();
      return;
    }

    setProgress(newProgress);
    animationRef.current = requestAnimationFrame(updateProgress);
  }, [isPaused, duration, onClose]);

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, updateProgress]);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = remainingTimeRef.current - elapsed;
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const styles = {
    success:
      "bg-(--background) text-(--foreground) border-(--accent-green) shadow-(--accent-green-alpha-10)",
    error:
      "bg-(--background) text-(--foreground) border-(--error) shadow-(--error-alpha-10)",
  };

  const progressStyles = {
    success: "bg-(--accent-green)",
    error: "bg-(--error)",
  };

  return (
    <div className="w-full fixed bottom-18 z-100 flex justify-end items-center px-4">
      <div
        className={`w-full max-w-md rounded-xl border shadow-2xl overflow-hidden cursor-pointer ${styles[type]}`}
        role="alert"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Progress bar at top */}
        <div className="h-1 w-full bg-(--muted) rounded-t-2xl">
          <div
            className={`h-full transition-none ${progressStyles[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className={`mt-0.5 shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
              type === "success" ? "bg-(--accent-green-alpha-20)" : "bg-(--error-alpha-20)"
            }`}
          >
            {type === "success" ? (
              <CheckCircleIcon className="w-5 h-5 text-(--accent-green)" />
            ) : (
              <ErrorIcon className="w-5 h-5 text-(--error)" />
            )}
          </div>

          <p className="flex-1 text-sm leading-snug text-(--text-body)">
            {message}
          </p>

          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded-md hover:bg-(--muted) transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4 text-(--text-subtle)" />
          </button>
        </div>
      </div>
    </div>
  );
}
