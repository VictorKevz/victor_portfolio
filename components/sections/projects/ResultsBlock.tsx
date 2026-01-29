import { ScoreRing } from "./ScoreRing";
import type { ProjectsLabels, ProjectResults } from "./types";

interface ResultsBlockProps {
  labels: ProjectsLabels;
  results: ProjectResults;
}

export function ResultsBlock({ labels, results }: ResultsBlockProps) {
  const performance = results.performance_lighthouse;
  const accessibility = results.accessibility_lighthouse;
  const bestPractices = results.best_practices_lighthouse;
  const seo = results.seo_lighthouse;
  const otherMetrics = results.other_metrics ?? [];

  const hasScores =
    Boolean(performance) ||
    Boolean(accessibility) ||
    Boolean(bestPractices) ||
    Boolean(seo);

  if (!hasScores && otherMetrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {hasScores ? (
        <div className="rounded-3xl border border-(--border-dark) p-5 bg-(--neutral-100)">
          <h4 className="text-xs uppercase tracking-[0.25em] font-semibold heading-text-dark">
            {labels.results}
          </h4>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            {performance ? (
              <ScoreRing label={labels.performance} score={performance} />
            ) : null}
            {accessibility ? (
              <ScoreRing label={labels.accessibility} score={accessibility} />
            ) : null}
            {bestPractices ? (
              <ScoreRing label={labels.bestPractices} score={bestPractices} />
            ) : null}
            {seo ? <ScoreRing label={labels.seo} score={seo} /> : null}
          </div>
        </div>
      ) : null}

      {otherMetrics.length > 0 ? (
        <div className="rounded-3xl border border-(--border-dark) bg-(--neutral-0)/60 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold heading-text-dark">
            {labels.otherMetrics}
          </p>
          <ul className="mt-2 space-y-2 text-sm body-text-dark">
            {otherMetrics.map((metric) => (
              <li key={metric} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-(--border-dark)" />
                <span>{metric}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
