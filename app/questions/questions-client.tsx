"use client";

import { useMemo, useState } from "react";
import { QuestionCard } from "@/components/question-card";
import { QuestionFilter } from "@/components/exam-session";
import type { Question } from "@/lib/questions";
import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";

export default function QuestionsPage({
  questions,
}: {
  questions: Question[];
}) {
  const [filter, setFilter] = useState<DomainId | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return questions;
    return questions.filter((q) => q.domain === filter);
  }, [questions, filter]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Practice questions</h1>
        <p className="text-muted-foreground">
          MCQ and scenario-style questions with detailed explanations. Filter by
          exam domain.
        </p>
      </div>

      <div className="mb-6">
        <QuestionFilter
          domains={DOMAINS.map((d) => d.id)}
          selected={filter}
          onChange={setFilter}
        />
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} question{filtered.length !== 1 && "s"}
      </p>

      <div className="space-y-4">
        {filtered.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}
