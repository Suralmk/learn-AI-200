import type { Metadata } from "next";
import Link from "next/link";
import { PathProgress } from "@/components/doc/path-progress";
import { StarPrompt } from "@/components/star-prompt";
import { getLearningPaths } from "@/lib/content";
import { EXAM, SKILL_AREAS } from "@/lib/exam-outline";
import { buildStudyNav } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Study notes",
  description: `${EXAM.code} study notes for all four skill areas: Container Apps, AKS, Cosmos DB, pgvector, Managed Redis, Service Bus, Functions, Key Vault and KQL.`,
  path: "/study",
  type: "website",
});

export default function StudyIndexPage() {
  const nav = buildStudyNav();
  const descriptions = new Map(getLearningPaths().map((p) => [p.slug, p.description]));

  return (
    <div className="px-4 py-10 sm:px-8 lg:py-14">
      <header className="max-w-[62ch]">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">{EXAM.code} study notes</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {nav.reduce((n, a) => n + a.paths.length, 0)} learning paths grouped by the official skill areas. Your reading progress stays in this browser.
        </p>
      </header>

      <div className="mt-14 space-y-16">
        {nav.map((area) => {
          const outline = SKILL_AREAS.find((a) => a.id === area.id)!;
          return (
            <section key={area.id} aria-labelledby={`study-${area.id}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                <h2 id={`study-${area.id}`} className="text-2xl font-semibold tracking-tight">
                  {outline.officialTitle}
                </h2>
                <span className="tabular text-sm text-muted-foreground">{area.weight} of the exam</span>
              </div>
              <ul className="divide-y divide-border">
                {area.paths.map((p) => (
                  <li key={p.slug} className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-10">
                    <div>
                      <Link href={p.href} className="text-lg font-semibold text-foreground hover:text-primary">
                        {p.title}
                      </Link>
                      <p className="mt-1.5 line-clamp-3 max-w-[70ch] text-muted-foreground">{descriptions.get(p.slug)}</p>
                    </div>
                    <PathProgress hrefs={p.topics.map((t) => t.href)} label={p.title} />
                  </li>
                ))}
              </ul>
              {area.guides.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Quick reference:{" "}
                  {area.guides.map((g, i) => (
                    <span key={g.href}>
                      {i > 0 && ", "}
                      <Link href={g.href} className="font-medium text-primary underline-offset-4 hover:underline">
                        {g.title}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <StarPrompt className="mt-16" />
    </div>
  );
}
