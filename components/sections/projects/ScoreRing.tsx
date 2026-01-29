interface ScoreRingProps {
  label: string;
  score: string;
}

export function ScoreRing({ label, score }: ScoreRingProps) {
  const numericScore = Number(score.replace(/[^0-9.]/g, ""));
  const value = Number.isFinite(numericScore)
    ? Math.min(Math.max(numericScore, 0), 100)
    : 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 52 52" className="h-full w-full">
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
            stroke="var(--gradient-primary-left)"
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold heading-text-dark">
          {value}
        </span>
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] heading-text-dark">
        {label}
      </span>
    </div>
  );
}
