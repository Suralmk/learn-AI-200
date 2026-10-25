import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/doc/breadcrumbs";
import { DocPage } from "@/components/doc/doc-page";
import { PathProgress, TopicReadMark } from "@/components/doc/path-progress";
import { Button } from "@/components/ui/button";
import { getLearningPath, getLearningPaths, getStudyGuide, getStudyGuides } from "@/lib/content";
import { EXAM, findSkillArea, getAreaForPath } from "@/lib/exam-outline";
import { getNavPath } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...getLearningPaths(), ...getStudyGuides()].map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLearningPath(slug) ?? getStudyGuide(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.description || `${EXAM.code} learning path: ${page.title}.`,
    path: `/study/${slug}`,
  });
}

export default async function StudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const href = `/study/${slug}`;
  const path = getLearningPath(slug);

  if (!path) {
    const guide = getStudyGuide(slug) ?? notFound();
    const area = findSkillArea(guide.domain);
    return (
      <DocPage
        href={href}
        title={guide.title}
        description={guide.description}
        content={guide.content}
        crumbs={[{ label: "Study", href: "/study" }, ...(area ? [{ label: area.title, href: `/study#study-${area.id}` }] : []), { label: guide.title }]}
        repoPath={guide.repoPath}
        objectives={guide.objectives}
        lastReviewed={guide.last_reviewed}
      />
    );
  }

  const area = getAreaForPath(slug);
  const nav = getNavPath(slug)!;
  const firstTopic = nav.topics[0];

  return (
    <div className="px-4 py-8 sm:px-8 lg:py-12">
      <Breadcrumbs crumbs={[{ label: "Study", href: "/study" }, { label: path.title }]} currentPath={href} />

      <header className="max-w-[70ch]">
        {area && (
          <p className="mb-3 text-sm text-muted-foreground">
            {area.officialTitle}, {area.weight} of the exam
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{path.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">{path.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          {firstTopic && (
            <Button size="lg" render={<Link href={firstTopic.href} />}>
              Start with {firstTopic.title}
            </Button>
          )}
          <PathProgress hrefs={nav.topics.map((t) => t.href)} label={path.title} />
        </div>
      </header>

      <div className="mt-14 max-w-3xl space-y-12">
        {nav.modules.map((m, index) => (
          <section key={m.name} aria-labelledby={`module-${index}`}>
            <h2 id={`module-${index}`} className="text-xl font-semibold tracking-tight">
              {m.name}
            </h2>
            {m.description && <p className="mt-2 text-muted-foreground">{m.description}</p>}
            {m.topics.length > 0 ? (
              <ol className="mt-5 divide-y divide-border border-y border-border">
                {m.topics.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="group flex items-center gap-3 py-3.5 text-foreground hover:text-primary">
                      <TopicReadMark href={t.href} />
                      <span className="flex-1 font-medium">{t.title}</span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Notes for this module are being written.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
