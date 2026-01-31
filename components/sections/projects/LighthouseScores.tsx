import { ScoreRing } from "./ScoreRing";

interface LighthouseScoreItem {
  label: string;
  score: string;
  variant: "primary" | "secondary";
}

interface LighthouseScoresProps {
  title: string;
  scores: LighthouseScoreItem[];
}

export function LighthouseScores({ title, scores }: LighthouseScoresProps) {
  if (scores.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-(--border-dark) p-5 bg-(--neutral-100)">
      <h4 className="text-xs uppercase tracking-[0.25em] font-semibold heading-text-dark">
        {title}
      </h4>
      <ul
        className="mt-4 flex flex-wrap items-center gap-4 lg:gap-3"
        aria-label={title}
      >
        {scores.map((score) => (
          <li key={score.label}>
            <ScoreRing
              label={score.label}
              score={score.score}
              variant={score.variant}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
