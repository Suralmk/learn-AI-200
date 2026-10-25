"use client";

import { memo, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { OptionButton, type OptionState } from "@/components/quiz/option-button";
import { getObjective } from "@/lib/exam-outline";
import { correctIndices, isMultiSelect } from "@/lib/answer";
import type { Question } from "@/lib/schemas";
import { isAnswerCorrect } from "@/lib/scoring";
import { cn } from "@/lib/utils";

function optionState(index: number, selected: number[], correct: number[], revealed: boolean): OptionState {
  const isSel = selected.includes(index);
  if (!revealed) return isSel ? "selected" : "idle";
  if (correct.includes(index)) return isSel ? "correct" : "missed";
  return isSel ? "incorrect" : "idle";
}

/** Question text, options and (once revealed) the explanation panel. */
export const QuestionCard = memo(function QuestionCard({
  question,
  selected,
  revealed,
  onSelect,
  headingId,
}: {
  question: Question;
  selected: number[];
  revealed: boolean;
  onSelect: (index: number) => void;
  headingId: string;
}) {
  const multi = isMultiSelect(question);
  const correct = correctIndices(question);
  const right = isAnswerCorrect(question, selected);
  const objective = question.objective ? getObjective(question.objective) : undefined;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIndex = selected[0] ?? 0;

  // Radio-group keyboard pattern: arrows move focus and selection (single-select only).
  function onGroupKeyDown(e: React.KeyboardEvent) {
    if (multi) return;
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const current = optionRefs.current.findIndex((el) => el === document.activeElement);
    const next = ((current < 0 ? focusIndex : current) + step + question.options.length) % question.options.length;
    optionRefs.current[next]?.focus();
    onSelect(next);
  }

  return (
    <div>
      <div id={headingId} tabIndex={-1} className="text-lg leading-relaxed text-foreground outline-none">
        <MarkdownContent content={question.question} variant="compact" className="text-foreground" />
      </div>
      {multi && (
        <p className="mt-2 text-sm font-medium text-primary">
          Select {correct.length} answers.
        </p>
      )}

      <div
        role={multi ? "group" : "radiogroup"}
        aria-labelledby={headingId}
        onKeyDown={onGroupKeyDown}
        className="mt-6 space-y-2.5"
      >
        {question.options.map((option, i) => (
          <OptionButton
            key={i}
            index={i}
            text={option}
            multi={multi}
            disabled={revealed}
            state={optionState(i, selected, correct, revealed)}
            onSelect={() => onSelect(i)}
            tabIndex={multi ? undefined : i === focusIndex ? 0 : -1}
            buttonRef={(el) => {
              optionRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {revealed && (
        <section
          aria-live="polite"
          className={cn(
            "mt-6 rounded-lg border px-5 py-4",
            right ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft"
          )}
        >
          <p className={cn("flex items-center gap-2 font-semibold", right ? "text-success" : "text-danger")}>
            {right ? <CheckCircle2 className="size-5" aria-hidden /> : <XCircle className="size-5" aria-hidden />}
            {right ? "Correct" : selected.length === 0 ? "Not answered" : "Not quite"}
          </p>
          <MarkdownContent content={question.explanation} variant="compact" className="mt-3 text-foreground/90" />
          {(question.relatedService || objective) && (
            <dl className="mt-4 grid gap-1 border-t border-border/70 pt-3 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:gap-x-3">
              {question.relatedService && (
                <>
                  <dt className="font-medium text-foreground">Service</dt>
                  <dd>{question.relatedService}</dd>
                </>
              )}
              {objective && (
                <>
                  <dt className="font-medium text-foreground">Objective</dt>
                  <dd>{objective.title}</dd>
                </>
              )}
            </dl>
          )}
        </section>
      )}
    </div>
  );
});
