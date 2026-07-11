"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  BookOpen,
  ClipboardList,
  ExternalLink,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import type { Domain } from "@/lib/domains";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PASS_THRESHOLD = 70;

interface DomainScore {
  domain: Domain;
  total: number;
  correct: number;
}

function fireCelebration() {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#0177d1", "#22c55e", "#facc15", "#ffffff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#0177d1", "#22c55e", "#facc15", "#ffffff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.55 },
    colors: ["#0177d1", "#22c55e", "#facc15", "#4ade80", "#ffffff"],
  });

  frame();
}

export function ExamResults({
  score,
  total,
  domainScores,
  studySlug,
  showDomainBreakdown = true,
  onRetake,
}: {
  score: number;
  total: number;
  domainScores: DomainScore[];
  studySlug?: string;
  showDomainBreakdown?: boolean;
  onRetake: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const passed = pct > PASS_THRESHOLD;

  useEffect(() => {
    if (passed) fireCelebration();
  }, [passed]);

  const weakDomains = domainScores.filter(
    (d) => d.total > 0 && (d.correct / d.total) * 100 < PASS_THRESHOLD
  );

  return (
    <div className="space-y-8">
      <div
        className={cn(
          "rounded-lg border-2 px-6 py-8 text-center",
          passed
            ? "border-green-500/40 bg-green-500/5"
            : "border-amber-500/40 bg-amber-500/5"
        )}
      >
        <div
          className={cn(
            "mx-auto mb-4 flex size-16 items-center justify-center rounded-full",
            passed ? "bg-green-500/15" : "bg-amber-500/15"
          )}
        >
          {passed ? (
            <PartyPopper
              className="size-8 animate-bounce text-green-600 dark:text-green-400"
              aria-hidden
            />
          ) : (
            <AlertTriangle
              className="size-8 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
          )}
        </div>

        {passed ? (
          <>
            <h2 className="mb-2 text-2xl font-semibold text-green-700 dark:text-green-400">
              Congratulations!
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              You scored above {PASS_THRESHOLD}% — great work. You&apos;re on
              track for the AI-200 exam. Keep reviewing weak domains and stay
              sharp.
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-semibold text-amber-700 dark:text-amber-400">
              Keep studying
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              You scored {pct}% — below the {PASS_THRESHOLD}% passing target.
              Review the study guides and practice more questions before your
              exam.
            </p>
          </>
        )}

        <p
          className={cn(
            "mt-6 text-4xl font-bold",
            passed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
          )}
        >
          {score}/{total} ({pct}%)
        </p>
      </div>

      {showDomainBreakdown && domainScores.length > 1 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Score by domain</p>
          <div className="space-y-2">
            {domainScores.map(({ domain, total: domainTotal, correct }) => {
              const domainPct =
                domainTotal > 0
                  ? Math.round((correct / domainTotal) * 100)
                  : 0;
              const domainPassed = domainPct >= PASS_THRESHOLD;

              return (
                <div
                  key={domain.id}
                  className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm"
                >
                  <span>{domain.title}</span>
                  <span
                    className={cn(
                      "font-medium",
                      domainPassed
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {correct}/{domainTotal} ({domainPct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!passed && showDomainBreakdown && weakDomains.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Focus on:{" "}
          {weakDomains.map((d) => d.domain.title).join(", ")}.
        </p>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium">
          {passed ? "Keep going" : "Recommended next steps"}
        </p>
        <div className="flex flex-wrap gap-2">
          {studySlug ? (
            <Button render={<Link href={`/study/${studySlug}`} />}>
              <BookOpen data-icon="inline-start" />
              Review study guide
            </Button>
          ) : (
            <Button render={<Link href="/study" />}>
              <BookOpen data-icon="inline-start" />
              Study materials
            </Button>
          )}
          <Button variant="outline" render={<Link href="/questions" />}>
            <ClipboardList data-icon="inline-start" />
            Practice questions
          </Button>
          <Button variant="outline" render={<Link href="/exam" />}>
            All exams
          </Button>
          <Button
            variant="outline"
            render={
              <a
                href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <ExternalLink data-icon="inline-start" />
            Official study guide
          </Button>
        </div>
      </div>

      <Button variant="outline" onClick={onRetake}>
        <RotateCcw data-icon="inline-start" />
        Retake exam
      </Button>
    </div>
  );
}
