import { LighthouseScores } from "./LighthouseScores";
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

  const scores = [
    performance
      ? { label: labels.performance, score: performance, variant: "primary" }
      : null,
    accessibility
      ? {
          label: labels.accessibility,
          score: accessibility,
          variant: "secondary",
        }
      : null,
    bestPractices
      ? {
          label: labels.bestPractices,
          score: bestPractices,
          variant: "primary",
        }
      : null,
    seo
      ? {
          label: labels.seo,
          score: seo,
          variant: "secondary",
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    score: string;
    variant: "primary" | "secondary";
  }>;

  if (scores.length === 0 && otherMetrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {scores.length > 0 ? (
        <LighthouseScores title={labels.results} scores={scores} />
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
