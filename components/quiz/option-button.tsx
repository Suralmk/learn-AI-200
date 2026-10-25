"use client";

import { Check, X } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { optionLetter } from "@/lib/quiz-keys";
import { cn } from "@/lib/utils";

export type OptionState = "idle" | "selected" | "correct" | "incorrect" | "missed";

/**
 * One answer option. Selection uses checkbox/radio semantics so screen
 * readers announce state; result states pair color with an icon and text.
 */
export function OptionButton({
  index,
  text,
  state,
  multi,
  disabled,
  onSelect,
  tabIndex,
  buttonRef,
}: {
  index: number;
  text: string;
  state: OptionState;
  multi: boolean;
  disabled: boolean;
  onSelect: () => void;
  /** Roving tabindex for single-select groups; undefined keeps normal tab order. */
  tabIndex?: number;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  const checked = state === "selected" || state === "correct" || state === "incorrect";
  const resultLabel =
    state === "correct" ? "Correct answer" : state === "incorrect" ? "Your answer, incorrect" : state === "missed" ? "Correct answer, not selected" : undefined;

  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={tabIndex}
      ref={buttonRef}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        "group flex w-full items-start gap-3.5 rounded-lg border bg-card px-4 py-3.5 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        state === "idle" && "border-border hover:border-primary/50 hover:bg-surface",
        state === "selected" && "border-primary bg-primary-soft",
        state === "correct" && "border-success bg-success-soft",
        state === "incorrect" && "border-danger bg-danger-soft",
        state === "missed" && "border-dashed border-success",
        disabled && state === "idle" && "opacity-70 hover:border-border hover:bg-card"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center border text-xs font-semibold tabular",
          multi ? "rounded-md" : "rounded-full",
          state === "idle" && "border-border-strong text-muted-foreground",
          state === "selected" && "border-primary bg-primary text-primary-foreground",
          state === "correct" && "border-success bg-success text-background",
          state === "incorrect" && "border-danger bg-danger text-background",
          state === "missed" && "border-success text-success"
        )}
      >
        {state === "correct" ? <Check className="size-3.5" /> : state === "incorrect" ? <X className="size-3.5" /> : optionLetter(index)}
      </span>
      <span className="min-w-0 flex-1">
        <MarkdownContent content={text} variant="compact" className="text-base text-foreground" />
        {resultLabel && <span className="mt-1 block text-xs font-medium text-muted-foreground">{resultLabel}</span>}
      </span>
    </button>
  );
}
