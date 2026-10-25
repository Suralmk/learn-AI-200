"use client";

import { useProgress } from "@/lib/use-progress";

/** Best score so far for a practice set, from local progress. */
export function SetBest({ setId }: { setId: string }) {
  const { sets } = useProgress();
  const s = sets[setId];
  if (!s) return <span className="text-sm text-muted-foreground">Not started</span>;
  return (
    <span className="tabular text-sm text-foreground">
      Best {s.bestPercent}%<span className="text-muted-foreground">, {s.attempts} attempt{s.attempts === 1 ? "" : "s"}</span>
    </span>
  );
}
