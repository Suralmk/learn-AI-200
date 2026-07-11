"use client";

import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import type { Exam } from "@/lib/exams";
import { DomainBadge } from "@/components/domain-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DomainId } from "@/lib/domains";

interface ExamWithCount extends Exam {
  availableQuestions: number;
}

export default function ExamListClient({
  exams,
}: {
  exams: ExamWithCount[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {exams.map((exam) => (
        <Link key={exam.id} href={`/exam/${exam.id}`}>
          <Card className="h-full transition-colors hover:border-primary/50">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <GraduationCap className="size-5 text-primary" />
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              {exam.domains === "all" ? (
                <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  All domains
                </span>
              ) : (
                exam.domains.map((domain) => (
                  <DomainBadge key={domain} domain={domain as DomainId} />
                ))
              )}
              <span className="text-xs text-muted-foreground">
                · {exam.availableQuestions} question
                {exam.availableQuestions !== 1 && "s"}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
