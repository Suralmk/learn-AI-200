"use client";

import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "@/components/question-card";
import { DomainFilter } from "@/components/domain-filter";
import type { Question, Difficulty } from "@/lib/questions";
import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/lib/utils";

export default function QuestionsPage({
  questions,
}: {
  questions: Question[];
}) {
  const [filter, setFilter] = useState<DomainId | "all">("all");
  const [level, setLevel] = useState<"all" | "advanced">("all");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = useMemo(() => {
    const list = questions.filter((q) => {
      const domainMatch = filter === "all" || q.domain === filter;
      const levelMatch =
        level === "all" ||
        (level === "advanced" && q.category === "advanced");
      const difficultyMatch =
        difficulty === "all" || q.difficulty === difficulty;
      return domainMatch && levelMatch && difficultyMatch;
    });
    return shuffleArray(list);
  }, [questions, filter, level, difficulty]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, level, difficulty]);

  useEffect(() => {
    if (currentIndex >= filtered.length && filtered.length > 0) {
      setCurrentIndex(filtered.length - 1);
    }
  }, [currentIndex, filtered.length]);

  const current = filtered[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === filtered.length - 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Practice questions</h1>
        <p className="text-muted-foreground">
          MCQ and scenario-style questions with detailed explanations. Filter by
          difficulty, exam domain, or advanced use-case scenarios.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "advanced"] as const).map((value) => (
          <Button
            key={value}
            variant={level === value ? "default" : "outline"}
            size="sm"
            onClick={() => setLevel(value)}
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
            onClick={() => setDifficulty(value)}
          >
            {value === "all" ? "All difficulties" : value}
          </Button>
        ))}
      </div>

      <div className="mb-6">
        <DomainFilter
          domains={DOMAINS.map((d) => d.id)}
          selected={filter}
          onChange={setFilter}
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
