"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { QuestionCard } from "@/components/question-card";
import { DomainFilter } from "@/components/domain-filter";
import type { Question, Difficulty } from "@/lib/questions";
import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";
import { Button } from "@/components/ui/button";
import { shuffleArray, shuffleQuestionOptions } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function QuestionsPage({
  questions,
}: {
  questions: Question[];
}) {
  const [filter, setFilter] = useState<DomainId | "all">("all");
  const [level, setLevel] = useState<"all" | "advanced">("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const filtered = useMemo(() => {
    if (!isMounted) return [];

    const list = questions.filter((q) => {
      const domainMatch = filter === "all" || q.domain === filter;
      const levelMatch =
        level === "all" ||
        (level === "advanced" && q.category === "advanced");
      const difficultyMatch =
        difficulty === "all" || q.difficulty === difficulty;
      return domainMatch && levelMatch && difficultyMatch;
    });
    const shuffledList = shuffleArray(list);
    return shuffledList.map(shuffleQuestionOptions);
  }, [questions, filter, level, difficulty, isMounted]);

  const handleFilterChange = (val: DomainId | "all") => {
    setFilter(val);
    setCurrentIndex(0);
  };

  const handleLevelChange = (val: "all" | "advanced") => {
    setLevel(val);
    setCurrentIndex(0);
  };

  const handleDifficultyChange = (val: "all" | Difficulty) => {
    setDifficulty(val);
    setCurrentIndex(0);
  };

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold">
            AI-200 Practice Questions
          </h1>
          <p className="text-muted-foreground">
            MCQ and scenario-style questions for the Azure AI Cloud Developer
            Associate exam. Filter by difficulty, exam domain, or advanced
            use-case scenarios.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="mb-6">
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="rounded-lg border border-border p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = filtered[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === filtered.length - 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">
          AI-200 Practice Questions
        </h1>
        <p className="text-muted-foreground">
          MCQ and scenario-style questions for the Azure AI Cloud Developer
          Associate exam. Filter by difficulty, exam domain, or advanced
          use-case scenarios.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "advanced"] as const).map((value) => (
          <Button
            key={value}
            variant={level === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleLevelChange(value)}
          >
            {value === "all" ? "All levels" : "Advanced scenarios"}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "Easy", "Medium", "Hard"] as const).map((value) => (
          <Button
            key={value}
            variant={difficulty === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange(value)}
          >
            {value === "all" ? "All difficulties" : value}
          </Button>
        ))}
      </div>

      <div className="mb-6">
        <DomainFilter
          domains={DOMAINS.map((d) => d.id)}
          selected={filter}
          onChange={handleFilterChange}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No questions match the current filters.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {filtered.length}
            </span>
            <span>
              {filtered.length} question{filtered.length !== 1 && "s"} total
            </span>
          </div>

          <QuestionCard
            key={current.id}
            question={current}
            number={currentIndex + 1}
          />

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="lg"
              disabled={isFirst}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </Button>
            <Button
              size="lg"
              className="min-w-36 px-8 text-base"
              disabled={isLast}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
