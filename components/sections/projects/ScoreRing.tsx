import { useId } from "react";

interface ScoreRingProps {
  label: string;
  score: string;
  variant: "primary" | "secondary";
}

export function ScoreRing({ label, score, variant }: ScoreRingProps) {
  const numericScore = Number(score.replace(/[^0-9.]/g, ""));
  const value = Number.isFinite(numericScore)
    ? Math.min(Math.max(numericScore, 0), 100)
    : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const gradientId = useId();
  const gradientStops =
    variant === "primary"
      ? { start: "var(--gradient-primary-left)", end: "var(--gradient-primary-right)" }
      : { start: "var(--gradient-secondary-left)", end: "var(--gradient-secondary-right)" };
  const bgClass = variant === "primary" ? "bg-gradient-primary" : "bg-gradient-secondary";

  return (
    <div
      className="flex flex-col items-center text-center gap-2"
      role="img"
      aria-label={`${label} score ${value} out of 100`}
    >
      <span className="sr-only">{`${label}: ${value} / 100`}</span>
      <div className="relative h-14 w-14" aria-hidden="true">
        <svg viewBox="0 0 52 52" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientStops.start} />
              <stop offset="100%" stopColor={gradientStops.end} />
            </linearGradient>
          </defs>
          <circle
            cx="26"
            cy="26"
            r={radius}
            stroke="var(--border-dark)"
            strokeWidth="5"
            fill="none"
            opacity="0.25"
          />
          <circle
            cx="26"
            cy="26"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
          />
        </svg>
        <span
          className={`absolute inset-1 rounded-full ${bgClass}`}
          style={{ opacity: 0.18 }}
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold heading-text-dark"
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
      <span
        className="text-[0.6rem] uppercase tracking-[0.25em] heading-text-dark"
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
}
