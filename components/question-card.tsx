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
  showAnswerOnSelect = true,
}: {
  question: Question;
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
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {question.type}
          </span>
        </div>
        <CardTitle className="text-base leading-relaxed font-normal">
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
