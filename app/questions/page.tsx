import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SetBest } from "@/components/quiz/set-best";
import { ALL_OBJECTIVES, EXAM, SKILL_AREAS } from "@/lib/exam-outline";
import { getAllQuestions, getQuestionsForObjective } from "@/lib/questions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Practice questions by objective",
  suffix: `${EXAM.code} Practice Questions`,
  description: `Free ${EXAM.code} practice questions for all ${ALL_OBJECTIVES.length} official objectives, with explanations for every answer. Pick an objective and check what you know.`,
  path: "/questions",
  type: "website",
});

export default function PracticeIndexPage() {
  const total = getAllQuestions().length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:py-16">
      <header className="max-w-[62ch]">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{EXAM.code} practice questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {total} questions mapped to the {ALL_OBJECTIVES.length} objectives in the official skills outline. Every answer comes with an explanation of why each option is right or wrong.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Want a full run instead?{" "}
          <Link href="/exam" className="font-medium text-primary underline-offset-4 hover:underline">
            Take a mock exam
          </Link>
          .
        </p>
      </header>

      <div className="mt-14 space-y-14">
        {SKILL_AREAS.map((area) => (
          <section key={area.id} aria-labelledby={`area-${area.id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <h2 id={`area-${area.id}`} className="text-xl font-semibold tracking-tight">
                {area.officialTitle}
              </h2>
              <span className="tabular text-sm text-muted-foreground">{area.weight} of the exam</span>
            </div>
            <ul className="divide-y divide-border">
              {area.objectives.map((o) => {
                const n = getQuestionsForObjective(o.id).length;
                return (
                  <li key={o.id}>
                    <Link
                      href={`/practice/${o.id}`}
                      className="group grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_10rem_9rem_auto] sm:items-center sm:gap-6"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary">{o.title}</span>
                      <span className="tabular text-sm text-muted-foreground">{n} questions</span>
                      <SetBest setId={`objective:${o.id}`} />
                      <ChevronRight className="hidden size-4 text-muted-foreground group-hover:text-primary sm:block" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
