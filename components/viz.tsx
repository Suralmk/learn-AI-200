import { WEIGHT_SCALE } from "@/lib/exam-outline";
import { cn } from "@/lib/utils";

/*
 * Small, dependency-free data visuals built to the dataviz rules:
 * one hue (chart-1) on a same-ramp track, 4px rounded data ends,
 * values in text ink (never series color), hover titles, and a
 * screen-reader equivalent for each mark.
 */

/** A single ratio against a limit, e.g. topics read in a learning path. */
export function Meter({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max}`}
      title={`${label}: ${value} of ${max}`}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-primary-soft", className)}
    >
      <div
        className="h-full rounded-full bg-chart-1 transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * The exam blueprint: each skill area's weight as a range on a shared
 * 0–40% axis. The solid part is the guaranteed minimum, the lighter
 * extension the upper bound.
 */
export function BlueprintBars({
  areas,
  className,
  renderLabel,
}: {
  areas: { id: string; title: string; weight: string; weightRange: [number, number] }[];
  className?: string;
  renderLabel?: (area: { id: string; title: string }) => React.ReactNode;
}) {
  const scale = WEIGHT_SCALE;
  return (
    <figure className={cn("w-full", className)}>
      <ul className="space-y-4">
        {areas.map((a) => {
          const [lo, hi] = a.weightRange;
          return (
            <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2">
              <span className="min-w-0 text-sm font-medium text-foreground">
                {renderLabel ? renderLabel(a) : a.title}
              </span>
              <span className="tabular text-sm text-muted-foreground">{a.weight}</span>
              <span
                className="col-span-2 flex h-2.5 w-full gap-0.5 rounded-full bg-muted"
                title={`${a.title}: ${a.weight} of the exam`}
                aria-hidden
              >
                <span className="h-full rounded-l-full bg-chart-1" style={{ width: `${(lo / scale) * 100}%` }} />
                <span
                  className="h-full rounded-r-full bg-chart-1/35"
                  style={{ width: `${((hi - lo) / scale) * 100}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="sr-only">
        Exam weight by skill area: {areas.map((a) => `${a.title} ${a.weight}`).join("; ")}.
      </figcaption>
    </figure>
  );
}

export function StatTile({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="tabular mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</dd>
      {detail && <dd className="mt-0.5 text-sm text-muted-foreground">{detail}</dd>}
    </div>
  );
}

/** Per-area accuracy with a pass reference line (default 70%). */
export function AccuracyBars({
  rows,
  passPercent = 70,
  className,
}: {
  rows: { label: string; correct: number; total: number }[];
  passPercent?: number;
  className?: string;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <ul className="space-y-4">
        {rows.map((r) => {
          const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
          return (
            <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2">
              <span className="min-w-0 text-sm font-medium text-foreground">{r.label}</span>
              <span className="tabular text-sm text-muted-foreground">
                {pct}% ({r.correct}/{r.total})
              </span>
              <span
                className="relative col-span-2 block h-2.5 w-full rounded-full bg-primary-soft"
                title={`${r.label}: ${r.correct} of ${r.total} correct (${pct}%)`}
                aria-hidden
              >
                <span className="absolute inset-y-0 left-0 rounded-full bg-chart-1" style={{ width: `${pct}%` }} />
                <span
                  className="absolute -inset-y-1 w-0.5 rounded-full bg-foreground/60"
                  style={{ left: `calc(${passPercent}% - 1px)` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-3 w-0.5 rounded-full bg-foreground/60" aria-hidden />
        {passPercent}% marks a passing level
      </figcaption>
      <table className="sr-only">
        <caption>Accuracy by skill area</caption>
        <thead>
          <tr>
            <th>Skill area</th>
            <th>Correct</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.correct}</td>
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
