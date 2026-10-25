import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { SetBest } from "@/components/quiz/set-best";
import { EXAM } from "@/lib/exam-outline";
import { EXAMS, getExamQuestionCount } from "@/lib/exams";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mock exams",
  suffix: `${EXAM.code} Practice Tests`,
  description: `Free ${EXAM.code} mock exams: a timed full-length run across all four skill areas, plus focused tests per area with a scaled score and per-area breakdown.`,
  path: "/exam",
  type: "website",
});

export default function ExamListPage() {
  const [full, ...rest] = [...EXAMS].sort((a, b) => (a.id === "full" ? -1 : b.id === "full" ? 1 : 0));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:py-16">
      <header className="max-w-[62ch]">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{EXAM.code} mock exams</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Answer everything first, then see a score on the 1,000-point scale ({EXAM.passScore} to pass) with accuracy for each skill area.
        </p>
      </header>

      <Link
        href={`/exam/${full.id}`}
        className="group mt-12 block rounded-lg border border-primary/30 bg-primary-soft p-6 transition-colors hover:border-primary sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[56ch]">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary">{full.title}</h2>
            <p className="mt-2 text-foreground/80">{full.description}</p>
          </div>
          <ChevronRight className="mt-1 size-6 text-primary" aria-hidden />
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/80">
          <span className="tabular">{getExamQuestionCount(full)} questions</span>
          {full.timerMinutes && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden /> Optional {full.timerMinutes}-minute timer
            </span>
          )}
          <SetBest setId={`exam:${full.id}`} />
        </div>
      </Link>

      <h2 className="mt-16 border-b border-border pb-3 text-xl font-semibold tracking-tight">Focused tests</h2>
      <ul className="divide-y divide-border">
        {rest.map((exam) => (
          <li key={exam.id}>
            <Link href={`/exam/${exam.id}`} className="group grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_8rem_9rem_auto] sm:items-center sm:gap-6">
              <span>
                <span className="block font-medium text-foreground group-hover:text-primary">{exam.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{exam.description}</span>
              </span>
              <span className="tabular text-sm text-muted-foreground">{getExamQuestionCount(exam)} questions</span>
              <SetBest setId={`exam:${exam.id}`} />
              <ChevronRight className="hidden size-4 text-muted-foreground group-hover:text-primary sm:block" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
