import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ListChecks, Sparkle, Timer } from "lucide-react";
import { BuyMeCoffee } from "@/components/buy-me-coffee";
import { CertBadge } from "@/components/cert-badge";
import { StarPrompt } from "@/components/star-prompt";
import { Button } from "@/components/ui/button";
import { UPCOMING_COURSES } from "@/lib/courses";
import { ALL_OBJECTIVES, EXAM, SKILL_AREAS, WEIGHT_SCALE } from "@/lib/exam-outline";
import { buildStudyNav } from "@/lib/nav";
import { getAllQuestions } from "@/lib/questions";
import { formatDate, pageMetadata } from "@/lib/seo";
import { CONTRIBUTING_URL, DEFAULT_TITLE, GITHUB_REPO_URL, SITE_DESCRIPTION } from "@/lib/site";
import { cn } from "@/lib/utils";
import heroBg from "@/public/images/hero-bg.jpg";
import ai200Badge from "@/public/images/badges/ai-200.png";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Free study notes and practice questions", description: SITE_DESCRIPTION, path: "/", type: "website" }),
  title: { absolute: DEFAULT_TITLE },
};

const STEPS = [
  { Icon: BookOpen, title: "Read the notes", body: "Key concepts, a diagram, CLI and Python you can run, and the traps the exam likes to set.", href: "/study", cta: "Browse study notes" },
  { Icon: ListChecks, title: "Practice each objective", body: "At least ten questions per official objective, each explaining why every option is right or wrong.", href: "/questions", cta: "Pick an objective" },
  { Icon: Timer, title: "Sit a mock exam", body: "A timed, full-length run scored out of 1,000 with accuracy per skill area.", href: "/exam", cta: "Start a mock exam" },
];

/** The heaviest-weighted area gets the highlighted card, as in the exam blueprint. */
const FEATURED_AREA = [...SKILL_AREAS].sort((a, b) => b.weightRange[1] - a.weightRange[1])[0].id;

export default function HomePage() {
  const nav = buildStudyNav();
  const topicCount = nav.reduce((n, a) => n + a.paths.reduce((m, p) => m + p.topics.length, 0), 0);
  const questionCount = getAllQuestions().length;
  const stats = [
    { value: topicCount, label: "topic pages" },
    { value: questionCount, label: "practice questions" },
    { value: ALL_OBJECTIVES.length, label: "official objectives" },
  ];

  return (
    <>
      {/* Hero: dark in both themes, over the gradient image. */}
      <section className="relative isolate overflow-hidden bg-[#050b18] text-white">
        <Image src={heroBg} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(5_11_24/0.92)_0%,rgb(5_11_24/0.7)_45%,rgb(5_11_24/0.15)_100%)]" />

        <div className="mx-auto flex min-h-[min(46rem,calc(100svh-4rem))] max-w-[90rem] flex-col justify-between gap-16 px-4 pt-20 pb-10 sm:px-8 lg:pt-28">
          <div className="max-w-3xl">
            <h1 className="text-[2.75rem] leading-[1.04] font-light tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Study for <span className="whitespace-nowrap">{EXAM.code}</span>, one objective at a time
            </h1>
            <p className="mt-7 max-w-[54ch] text-lg text-white/80 text-pretty">
              Free, open-source notes, practice questions and mock exams for {EXAM.title}, organized exactly like the official skills outline.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 px-6 text-base" render={<Link href="/study" />}>
                Start studying
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-white/5 px-6 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white dark:bg-white/5 dark:hover:bg-white/15"
                render={<Link href="/questions" />}
              >
                Practice questions
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <BuyMeCoffee size="sm" />
              <span>Free forever. Coffee keeps the notes coming.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="tabular text-3xl font-light">{s.value}</dd>
                  <dd className="text-sm text-white/70">{s.label}</dd>
                </div>
              ))}
            </dl>
            <figure className="flex items-center gap-4">
              <Image src={ai200Badge} alt={`${EXAM.certification} badge`} width={112} height={111} className="size-24 drop-shadow-[0_8px_24px_rgb(1_119_209/0.45)] sm:size-28" />
              <figcaption className="max-w-[16ch] text-sm text-white/75">
                Prepares you for {EXAM.code}, outline of{" "}
                <a href={EXAM.studyGuideUrl} target="_blank" rel="noopener noreferrer" className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  {formatDate(EXAM.sourceVersion)}
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Skill areas as numbered cards, weighted like the exam. */}
      <section aria-labelledby="areas-heading" className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-28">
        <h2 id="areas-heading" className="max-w-[20ch] text-4xl font-light tracking-tight text-balance sm:text-5xl">
          Four skill areas, weighted like the exam
        </h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SKILL_AREAS.map((area, i) => {
            const featured = area.id === FEATURED_AREA;
            const paths = nav.find((n) => n.id === area.id)?.paths ?? [];
            const [lo, hi] = area.weightRange;
            return (
              <li key={area.id}>
                <Link
                  href={`/study#study-${area.id}`}
                  className={cn(
                    "group relative flex h-full min-h-72 flex-col rounded-lg border p-6 transition-colors",
                    featured
                      ? "border-transparent bg-[linear-gradient(150deg,#1f6fff_0%,#0d3fa8_55%,#0a1220_100%)] text-white"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <span className={cn("tabular text-4xl font-light", featured ? "text-white" : "text-foreground")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-6 text-lg font-semibold">{area.title}</span>
                  <span className={cn("mt-2 text-sm", featured ? "text-white/80" : "text-muted-foreground")}>{area.description}</span>
                  <span className="mt-auto pt-6">
                    <span className="flex items-baseline justify-between text-sm">
                      <span className={featured ? "text-white/80" : "text-muted-foreground"}>
                        {paths.length} learning path{paths.length === 1 ? "" : "s"}
                      </span>
                      <span className="tabular font-medium">{area.weight}</span>
                    </span>
                    <span aria-hidden className={cn("mt-2 flex h-1.5 gap-0.5 rounded-full", featured ? "bg-white/20" : "bg-muted")}>
                      <span className={cn("rounded-l-full", featured ? "bg-white" : "bg-chart-1")} style={{ width: `${(lo / WEIGHT_SCALE) * 100}%` }} />
                      <span className={cn("rounded-r-full", featured ? "bg-white/50" : "bg-chart-1/35")} style={{ width: `${((hi - lo) / WEIGHT_SCALE) * 100}%` }} />
                    </span>
                  </span>
                  <Sparkle aria-hidden className={cn("absolute top-6 right-6 size-4", featured ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="how-heading" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8">
          <h2 id="how-heading" className="max-w-[24ch] text-4xl font-light tracking-tight text-balance sm:text-5xl">
            Read, practice, then prove it
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {STEPS.map(({ Icon, title, body, href, cta }) => (
              <li key={title} className="border-t border-border-strong pt-6">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-muted-foreground">{body}</p>
                <Link href={href} className="mt-4 inline-block font-medium text-primary underline-offset-4 hover:underline">
                  {cta}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Other certifications on the roadmap. */}
      <section aria-labelledby="courses-heading" className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="courses-heading" className="max-w-[20ch] text-4xl font-light tracking-tight text-balance sm:text-5xl">
              More Azure courses coming soon
            </h2>
            <p className="mt-4 max-w-[56ch] text-muted-foreground">
              The same notes, practice and mock exams, for more certifications. Star the repository to follow along, or tell us which one you need first.
            </p>
          </div>
          <Button variant="outline" size="lg" render={<a href={`${GITHUB_REPO_URL}/issues/new/choose`} target="_blank" rel="noopener noreferrer" />}>
            Request a course
          </Button>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING_COURSES.map((c) => (
            <li key={c.code} className="flex items-center gap-5 rounded-lg border border-border bg-card p-5">
              <CertBadge code={c.code} level={c.level} className="w-20 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{c.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Exam {c.code}, {c.level.toLowerCase()}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary-strong">Coming soon</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Want to help write one?{" "}
          <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
            Read the contributing guide
          </a>
          .
        </p>
      </section>

      <section className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <StarPrompt variant="section" />
      </section>
    </>
  );
}
