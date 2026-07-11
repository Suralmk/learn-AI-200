"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/questions";
import type { Exam } from "@/lib/exams";
import { DOMAINS } from "@/lib/domains";
import { ExamResults } from "@/components/exam-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ExamSession({
  exam,
  questions,
  studySlug,
}: {
  exam: Exam;
  questions: Question[];
  studySlug?: string;
}) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const examQuestions = useMemo(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(
      0,
      Math.min(exam.questionCount, shuffled.length)
    );
  }, [questions, exam.questionCount, attempt]);

  const current = examQuestions[currentIndex];
  const score = examQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;

  function handleRetake() {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setAttempt((a) => a + 1);
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No questions available for this exam yet.
        </CardContent>
      </Card>
    );
  }

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ready to start?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {examQuestions.length} question
            {examQuestions.length !== 1 && "s"} in this exam. Answer each one,
            then review your score at the end.
          </p>
          {exam.domains === "all" && (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {DOMAINS.map((d) => (
                <li key={d.id}>
                  • {d.title} ({d.weight})
                </li>
              ))}
            </ul>
          )}
          <Button onClick={() => setStarted(true)}>Start exam</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const domainScores = DOMAINS.map((d) => {
      const domainQs = examQuestions.filter((q) => q.domain === d.id);
      const domainScore = domainQs.filter(
        (q) => answers[q.id] === q.answer
      ).length;
      return { domain: d, total: domainQs.length, correct: domainScore };
    }).filter((d) => d.total > 0);

    return (
      <ExamResults
        score={score}
        total={examQuestions.length}
        domainScores={domainScores}
        studySlug={studySlug}
        showDomainBreakdown={exam.domains === "all"}
        onRetake={handleRetake}
      />
    );
  }

  if (!current) return null;

  const selected = answers[current.id] ?? null;
  const answered = selected !== null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentIndex + 1} of {examQuestions.length}
        </span>
        <span>
          Answered: {Object.keys(answers).length}/{examQuestions.length}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
        <p className="mb-6 text-lg leading-relaxed">{current.question}</p>
        <div className="space-y-3">
          {current.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [current.id]: index }))
              }
              className={cn(
                "flex w-full items-start gap-4 rounded-md border px-4 py-3.5 text-left text-base transition-colors hover:border-primary/50",
                selected === index
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <span className="mt-0.5 font-mono text-sm text-muted-foreground">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="leading-relaxed">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Previous
        </Button>
        {currentIndex < examQuestions.length - 1 ? (
          <Button
            disabled={!answered}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={Object.keys(answers).length < examQuestions.length}
            onClick={() => setFinished(true)}
          >
            Finish exam
          </Button>
        )}
      </div>
    </div>
  );
}
