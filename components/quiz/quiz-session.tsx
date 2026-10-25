"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Keyboard, RotateCcw } from "lucide-react";
import { Countdown } from "@/components/quiz/countdown";
import { QuestionCard } from "@/components/quiz/question-card";
import { Meter } from "@/components/viz";
import { isMultiSelect } from "@/lib/answer";
import { ScoreSummary } from "@/components/quiz/score-summary";
import { Button } from "@/components/ui/button";
import { progressStore } from "@/lib/progress";
import { CONTRIBUTING_URL } from "@/lib/site";
import { keyToOption, toggleSelection } from "@/lib/quiz-keys";
import type { Question } from "@/lib/schemas";
import { isPassingScore, scoreSession, type Answers } from "@/lib/scoring";
import { cn, shuffleArray, shuffleQuestionOptions } from "@/lib/utils";

type Feedback = "immediate" | "end";
type Phase = "intro" | "running" | "results" | "review";

const NONE: number[] = [];

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest("input, textarea, select, [contenteditable], [role=dialog]");
}

/**
 * Runs a practice set or mock exam. Questions and options are shuffled
 * when the session starts (client-side only, so server HTML matches).
 */
export function QuizSession({
  setId,
  questions: inlineQuestions,
  questionsUrl,
  count,
  defaultFeedback = "immediate",
  timerMinutes,
  showAreas = false,
  backHref,
  backLabel,
}: {
  setId: string;
  /** Inline pool (small sets), or… */
  questions?: Question[];
  /** …a URL to fetch the pool from when the session starts (large mock exams). */
  questionsUrl?: string;
  count?: number;
  defaultFeedback?: Feedback;
  timerMinutes?: number;
  showAreas?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  const [loaded, setLoaded] = useState<Question[] | null>(inlineQuestions ?? null);
  const [loadError, setLoadError] = useState(false);
  const total = count ?? inlineQuestions?.length ?? 0;
  const [phase, setPhase] = useState<Phase>("intro");
  const [feedback, setFeedback] = useState<Feedback>(defaultFeedback);
  const [useTimer, setUseTimer] = useState(Boolean(timerMinutes));
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const current = deck[index];
  const selected = (current && answers[current.id]) || NONE;
  const revealed = current ? feedback === "immediate" && !!checked[current.id] : false;
  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length;
  const score = useMemo(() => scoreSession(deck, answers), [deck, answers]);

  const start = useCallback(async () => {
    let questions = loaded;
    if (!questions && questionsUrl) {
      try {
        const res = await fetch(questionsUrl);
        if (!res.ok) throw new Error(String(res.status));
        questions = (await res.json()) as Question[];
        setLoaded(questions);
        setLoadError(false);
      } catch {
        setLoadError(true);
        return;
      }
    }
    if (!questions) return;
    setDeck(shuffleArray(questions).slice(0, total).map(shuffleQuestionOptions));
    setIndex(0);
    setAnswers({});
    setChecked({});
    setEndsAt(useTimer && timerMinutes ? Date.now() + timerMinutes * 60_000 : null);
    setPhase("running");
  }, [loaded, questionsUrl, total, useTimer, timerMinutes]);

  const finish = useCallback(() => {
    progressStore.recordAttempt(setId, score.percent);
    setPhase("results");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && isPassingScore(score)) {
      import("canvas-confetti").then(({ default: confetti }) =>
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.3 }, colors: ["#0177d1", "#5fa8e8", "#f0643a"] })
      );
    }
  }, [score, setId]);

  // Move focus to the new question's text (or the results) so screen readers announce it.
  const currentId = current?.id;
  useEffect(() => {
    if (phase === "running" && currentId) document.getElementById(`q-${currentId}`)?.focus();
    else if (phase === "results") topRef.current?.focus();
  }, [currentId, phase]);

  const select = useCallback(
    (i: number) => {
      if (!current || revealed) return;
      setAnswers((prev) => ({ ...prev, [current.id]: toggleSelection(prev[current.id] ?? [], i, isMultiSelect(current)) }));
    },
    [current, revealed]
  );

  const isLast = index === deck.length - 1;
  const canSubmit = selected.length > 0;

  const next = useCallback(() => {
    if (isLast) finish();
    else setIndex((i) => i + 1);
  }, [isLast, finish]);

  const primaryAction = useCallback(() => {
    if (!current) return;
    if (feedback === "immediate" && !revealed) {
      if (canSubmit) setChecked((c) => ({ ...c, [current.id]: true }));
      return;
    }
    if (canSubmit || revealed) next();
  }, [current, feedback, revealed, canSubmit, next]);

  useEffect(() => {
    if (phase !== "running" || !current) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      const option = keyToOption(e.key, current!.options.length);
      if (option !== null) {
        e.preventDefault();
        select(option);
      } else if (e.key === "Enter") {
        // Let focused controls act, except answer options: Enter there means "check", not "toggle".
        const control = (e.target as HTMLElement).closest("button, a");
        if (control && !control.matches("[role=radio], [role=checkbox]")) return;
        e.preventDefault();
        primaryAction();
      } else if (e.key.toLowerCase() === "n" && (revealed || feedback === "end")) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, current, select, primaryAction, next, revealed, feedback]);

  if (total === 0) {
    return (
      <p className="rounded-lg border border-border bg-surface px-5 py-6 text-muted-foreground">
        No questions in this set yet.{" "}
        <a className="font-medium text-primary underline" href={CONTRIBUTING_URL}>
          Contribute one
        </a>
        .
      </p>
    );
  }

  if (phase === "intro") {
    return (
      <section aria-labelledby="intro-heading" className="max-w-2xl">
        <h2 id="intro-heading" className="text-xl font-semibold">
          {total} question{total === 1 ? "" : "s"}
        </h2>
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-foreground">When to see answers</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["immediate", "After each question", "Check your answer and read the explanation as you go."],
                ["end", "At the end", "Answer everything first, like the real exam, then review."],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                  feedback === value ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong"
                )}
              >
                <input
                  type="radio"
                  name="feedback"
                  value={value}
                  checked={feedback === value}
                  onChange={() => setFeedback(value)}
                  className="mt-1 accent-[var(--primary)]"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {timerMinutes && (
          <label className="mt-4 flex items-center gap-3 text-sm text-foreground">
            <input type="checkbox" checked={useTimer} onChange={(e) => setUseTimer(e.target.checked)} className="size-4 accent-[var(--primary)]" />
            Time me ({timerMinutes} minutes, like the real exam)
          </label>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={start}>
            Start
          </Button>
          {loadError && (
            <p role="alert" className="text-sm text-danger">
              The questions didn&apos;t load. Check your connection and press Start again.
            </p>
          )}
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="size-4" aria-hidden />
            Keys: 1–9 or A–D to choose, Enter to check, N for next
          </p>
        </div>
      </section>
    );
  }

  if (phase === "results" || phase === "review") {
    const wrong = deck.filter((q) => score.wrongIds.includes(q.id));
    return (
      <div ref={topRef} tabIndex={-1} aria-labelledby="score-heading" role="region" className="outline-none">
        <ScoreSummary score={score} showAreas={showAreas} />
        <div className="mt-10 flex flex-wrap gap-3">
          {wrong.length > 0 && phase === "results" && (
            <Button size="lg" onClick={() => setPhase("review")}>
              Review {wrong.length} wrong answer{wrong.length === 1 ? "" : "s"}
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={() => setPhase("intro")}>
            <RotateCcw data-icon="inline-start" />
            Try a new set
          </Button>
          {backHref && (
            <Button size="lg" variant="ghost" render={<Link href={backHref} />}>
              {backLabel ?? "Back"}
            </Button>
          )}
        </div>
        {phase === "review" && (
          <section aria-labelledby="review-heading" className="mt-14">
            <h2 id="review-heading" className="text-xl font-semibold">
              Questions to review
            </h2>
            <ol className="mt-6 space-y-12">
              {wrong.map((q, i) => (
                <li key={q.id} className="border-t border-border pt-8">
                  <p className="mb-3 text-sm text-muted-foreground">
                    {i + 1} of {wrong.length}
                  </p>
                  <QuestionCard question={q} selected={answers[q.id] ?? []} revealed onSelect={() => {}} headingId={`review-${q.id}`} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="tabular">
          Question <span className="font-semibold text-foreground">{index + 1}</span> of {deck.length}
          {feedback === "end" && <>, {answeredCount} answered</>}
        </p>
        {endsAt !== null && <Countdown endsAt={endsAt} onExpire={finish} />}
      </div>
      <Meter value={index + 1} max={deck.length} label="Question" className="mb-8 h-1" />

      <QuestionCard question={current} selected={selected} revealed={revealed} onSelect={select} headingId={`q-${current.id}`} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="lg" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          <ArrowLeft data-icon="inline-start" />
          Previous
        </Button>
        <div className="flex gap-2">
          {feedback === "end" && isLast && answeredCount < deck.length && (
            <Button variant="outline" size="lg" onClick={finish}>
              Finish with {deck.length - answeredCount} unanswered
            </Button>
          )}
          {feedback === "immediate" && !revealed ? (
            <Button size="lg" disabled={!canSubmit} onClick={primaryAction}>
              Check answer
            </Button>
          ) : (
            // In "end" mode questions can be skipped and come back to, like the real exam.
            <Button size="lg" onClick={next}>
              {isLast ? "See results" : "Next question"}
              {!isLast && <ArrowRight data-icon="inline-end" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
