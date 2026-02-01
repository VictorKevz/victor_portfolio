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
        className="mt-4 flex flex-wrap gap-y-3 lg:w-full lg:flex-nowrap lg:items-center lg:justify-between lg:gap-0"
        aria-label={title}
      >
        {scores.map((score, index) => {
          const align: "start" | "end" = index % 2 === 0 ? "start" : "end";
          return (
          <li
            key={score.label}
            className={`w-1/2 flex items-center ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            } lg:w-auto lg:justify-center`}
          >
            <ScoreRing
              label={score.label}
              score={score.score}
              variant={score.variant}
              align={align}
              className="lg:items-center lg:text-center"
            />
          </li>
          );
        })}
      </ul>
    </div>
  );
}
