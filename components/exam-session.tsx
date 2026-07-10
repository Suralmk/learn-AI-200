"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/questions";
import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXAM_SIZE = 20;

export function ExamSession({ questions }: { questions: Question[] }) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const examQuestions = useMemo(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(EXAM_SIZE, shuffled.length));
  }, [questions]);

  const current = examQuestions[currentIndex];
  const score = examQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Practice Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {examQuestions.length} questions drawn from all AI-200 domains.
            Answer each question, then review your score at the end.
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {DOMAINS.map((d) => (
              <li key={d.id}>
                • {d.title} ({d.weight})
              </li>
            ))}
          </ul>
          <Button onClick={() => setStarted(true)}>Start exam</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const pct = Math.round((score / examQuestions.length) * 100);
    const weakDomains = DOMAINS.map((d) => {
      const domainQs = examQuestions.filter((q) => q.domain === d.id);
      const domainScore = domainQs.filter(
        (q) => answers[q.id] === q.answer
      ).length;
      return { domain: d, total: domainQs.length, correct: domainScore };
    }).filter((d) => d.total > 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-semibold text-[#2596be]">
            {score}/{examQuestions.length} ({pct}%)
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">By domain</p>
            {weakDomains.map(({ domain, total, correct }) => (
              <div
                key={domain.id}
                className="flex items-center justify-between text-sm"
              >
                <span>{domain.title}</span>
                <span className="text-muted-foreground">
                  {correct}/{total}
                </span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              setStarted(false);
              setCurrentIndex(0);
              setAnswers({});
              setFinished(false);
            }}
          >
            Retake exam
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!current) return null;

  const selected = answers[current.id] ?? null;
  const answered = selected !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentIndex + 1} of {examQuestions.length}
        </span>
        <span>
          Answered: {Object.keys(answers).length}/{examQuestions.length}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-relaxed font-normal">
            {current.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {current.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [current.id]: index }))
              }
              className={`flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors hover:border-[#2596be]/50 ${
                selected === index
                  ? "border-[#2596be] bg-[#2596be]/5"
                  : "border-border"
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + index)}.
              </span>
              <span>{option}</span>
            </button>
          ))}
        </CardContent>
      </Card>

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

export function QuestionFilter({
  domains,
  selected,
  onChange,
}: {
  domains: DomainId[];
  selected: DomainId | "all";
  onChange: (domain: DomainId | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("all")}
      >
        All
      </Button>
      {domains.map((id) => {
        const domain = DOMAINS.find((d) => d.id === id)!;
        return (
          <Button
            key={id}
            variant={selected === id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(id)}
          >
            {domain.title}
          </Button>
        );
      })}
    </div>
  );
}
