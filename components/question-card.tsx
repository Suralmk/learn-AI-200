"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "@/lib/questions";
import { DomainBadge } from "@/components/domain-badge";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QuestionCard({
  question,
  number,
  showAnswerOnSelect = true,
}: {
  question: Question;
  number?: number;
  showAnswerOnSelect?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <DomainBadge domain={question.domain} />
          {question.difficulty && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                question.difficulty === "Easy" &&
                  "bg-green-500/10 text-green-700 dark:text-green-400",
                question.difficulty === "Medium" &&
                  "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                question.difficulty === "Hard" &&
                  "bg-red-500/10 text-red-700 dark:text-red-400"
              )}
            >
              {question.difficulty}
            </span>
          )}
          {question.category === "advanced" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Advanced
            </span>
          )}
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {question.type}
          </span>
        </div>
        <CardTitle className="text-base leading-relaxed font-normal">
          {number !== undefined && (
            <span className="mr-2 font-semibold text-primary">
              {number}.
            </span>
          )}
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isAnswer = question.answer === index;

            return (
              <button
                key={index}
                type="button"
                disabled={answered && showAnswerOnSelect}
                onClick={() => setSelected(index)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                  !answered && "hover:border-primary/50 hover:bg-muted/50",
                  isSelected && !answered && "border-primary bg-primary/5",
                  answered && isAnswer && "border-green-600 bg-green-500/10",
                  answered &&
                    isSelected &&
                    !isAnswer &&
                    "border-red-600 bg-red-500/10"
                )}
              >
                <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {answered && isAnswer && (
                  <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                )}
                {answered && isSelected && !isAnswer && (
                  <XCircle className="size-4 shrink-0 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {answered && showAnswerOnSelect && (
          <div
            className={cn(
              "rounded-md border px-4 py-3",
              isCorrect
                ? "border-green-600/30 bg-green-500/5"
                : "border-red-600/30 bg-red-500/5"
            )}
          >
            <p className="mb-2 text-sm font-medium">
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            <MarkdownContent content={question.explanation} />
            {(question.relatedService || question.relatedObjective) && (
              <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
                {question.relatedService && (
                  <p>
                    <span className="font-medium text-foreground">
                      Related Azure Service:
                    </span>{" "}
                    {question.relatedService}
                  </p>
                )}
                {question.relatedObjective && (
                  <p>
                    <span className="font-medium text-foreground">
                      Related AI-200 Objective:
                    </span>{" "}
                    {question.relatedObjective}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {answered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected(null)}
          >
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
