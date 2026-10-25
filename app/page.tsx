import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ListChecks, Timer } from "lucide-react";
import { StarPrompt } from "@/components/star-prompt";
import { Button } from "@/components/ui/button";
import { BlueprintBars } from "@/components/viz";
import { EXAM, SKILL_AREAS } from "@/lib/exam-outline";
import { buildStudyNav } from "@/lib/nav";
import { getAllQuestions } from "@/lib/questions";
import { formatDate, pageMetadata } from "@/lib/seo";
import { DEFAULT_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Free study notes and practice questions",
    description: SITE_DESCRIPTION,
    path: "/",
    type: "website",
  }),
  title: { absolute: DEFAULT_TITLE },
};

const STEPS = [
  {
    Icon: BookOpen,
    title: "Read the notes",
    body: "Each topic covers key concepts, a diagram, CLI and Python you can run, and the traps the exam likes to set.",
    href: "/study",
    cta: "Browse study notes",
  },
  {
    Icon: ListChecks,
    title: "Practice each objective",
    body: "At least ten questions for every official objective, each with an explanation of why the other options are wrong.",
    href: "/questions",
    cta: "Pick an objective",
  },
  {
    Icon: Timer,
    title: "Sit a mock exam",
    body: "A timed, full-length run scored out of 1,000 with accuracy per skill area, so you know where to go back to.",
    href: "/exam",
    cta: "Start a mock exam",
  },
];

export default function HomePage() {
  const nav = buildStudyNav();
  const topicCount = nav.reduce((n, a) => n + a.paths.reduce((m, p) => m + p.topics.length, 0), 0);
  const questionCount = getAllQuestions().length;

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[90rem] gap-14 px-4 pt-16 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-20 lg:pt-24 lg:pb-28">
          <div>
            <h1 className="max-w-[18ch] text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
              Study for {EXAM.code} with notes and practice for every objective
            </h1>
            <p className="mt-6 max-w-[56ch] text-lg text-muted-foreground text-pretty">
              Free, open-source preparation for Exam {EXAM.code}: {EXAM.title}. {topicCount} topic pages and {questionCount} practice
              questions, organized exactly like the official skills outline.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="h-11 px-5 text-[0.9375rem]" render={<Link href="/study" />}>
                Start studying
              </Button>
              <Button size="lg" variant="outline" className="h-11 px-5 text-[0.9375rem]" render={<Link href="/questions" />}>
                Practice questions
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Based on the skills measured as of{" "}
              <a href={EXAM.studyGuideUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong underline-offset-4 hover:text-foreground">
                {formatDate(EXAM.sourceVersion)}
              </a>
              .
            </p>
          </div>

          <figure className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <figcaption className="mb-6">
              <span className="block text-base font-semibold text-foreground">What the exam weighs</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Share of questions per skill area. Data management carries the most.
              </span>
            </figcaption>
            <BlueprintBars
              areas={SKILL_AREAS}
              renderLabel={(a) => (
                <Link href={`/questions#area-${a.id}`} className="hover:text-primary">
                  {SKILL_AREAS.find((x) => x.id === a.id)?.officialTitle}
                </Link>
              )}
            />
          </figure>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8">
        <h2 id="how-heading" className="max-w-[30ch] text-3xl font-semibold tracking-tight text-balance">
          Read, practice, then prove it under exam conditions
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map(({ Icon, title, body, href, cta }) => (
            <li key={title} className="border-t border-border pt-6">
              <Icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground">{body}</p>
              <Link href={href} className="mt-4 inline-block font-medium text-primary underline-offset-4 hover:underline">
                {cta}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="areas-heading" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8">
          <h2 id="areas-heading" className="text-3xl font-semibold tracking-tight">
            The four skill areas
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {nav.map((area) => {
              const outline = SKILL_AREAS.find((a) => a.id === area.id)!;
              return (
                <section key={area.id} aria-labelledby={`home-${area.id}`}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <h3 id={`home-${area.id}`} className="text-lg font-semibold text-foreground">
                      {outline.officialTitle}
                    </h3>
                    <span className="tabular shrink-0 text-sm text-muted-foreground">{area.weight}</span>
                  </div>
                  <p className="mt-3 text-muted-foreground">{outline.description}</p>
                  <ul className="mt-4 space-y-1">
                    {area.paths.map((p) => (
                      <li key={p.slug}>
                        <Link href={p.href} className="group flex items-baseline justify-between gap-4 py-1.5 text-foreground hover:text-primary">
                          <span className="font-medium">{p.title}</span>
                          <span className="tabular shrink-0 text-sm text-muted-foreground">{p.topics.length} topics</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-4 pt-20 sm:px-8">
        <StarPrompt variant="section" />
      </section>
    </>
  );
}
