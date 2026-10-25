"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import { AccuracyBars, StatTile } from "@/components/viz";
import { DOMAIN_TITLES } from "@/lib/domains";
import { EXAM } from "@/lib/exam-outline";
import { isPassingScore, sessionScaledScore, type SessionScore } from "@/lib/scoring";
import { cn } from "@/lib/utils";

/** The 700/1000 pass mark as a percentage, for the accuracy bars. */
const PASS_PERCENT = EXAM.passScore / 10;

/** Result screen: scaled score against the 700 pass mark, tiles and per-area accuracy. */
export function ScoreSummary({ score, showAreas }: { score: SessionScore; showAreas: boolean }) {
  const scaled = sessionScaledScore(score);
  const passed = isPassingScore(score);
  const rows = score.byDomain.map((d) => ({
    label: DOMAIN_TITLES[d.domain],
    correct: d.correct,
    total: d.total,
  }));

  return (
    <section aria-labelledby="score-heading" className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="score-heading" className="text-sm font-medium text-muted-foreground">
            Your score
          </h2>
          <p className="tabular mt-1 text-6xl font-semibold tracking-tight text-foreground">
            {scaled}
            <span className="text-2xl font-medium text-muted-foreground"> / 1000</span>
          </p>
        </div>
        <p
          className={cn(
            "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-sm font-semibold sm:self-auto",
            passed ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          )}
        >
          {passed ? <CheckCircle2 className="size-4" aria-hidden /> : <CircleAlert className="size-4" aria-hidden />}
          {passed ? `At or above the ${EXAM.passScore} pass mark` : `Below the ${EXAM.passScore} pass mark`}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-3">
        <StatTile label="Correct" value={`${score.correct} of ${score.total}`} />
        <StatTile label="Accuracy" value={`${score.percent}%`} />
        <StatTile label="To review" value={score.wrongIds.length} detail={score.wrongIds.length ? "questions" : "nothing missed"} className="col-span-2 sm:col-span-1" />
      </dl>

      {showAreas && rows.length > 0 && (
        <div>
          <h3 className="mb-5 text-base font-semibold text-foreground">Accuracy by skill area</h3>
          <AccuracyBars rows={rows} passPercent={PASS_PERCENT} />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Practice scores are a guide, not a prediction. Microsoft scales real exam scores per question set.
      </p>
    </section>
  );
}
