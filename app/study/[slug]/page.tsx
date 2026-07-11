import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DomainBadge } from "@/components/domain-badge";
import { MarkdownContent } from "@/components/markdown-content";
import { ModuleAccordion } from "@/components/module-accordion";
import { Button } from "@/components/ui/button";
import {
  getStudyGuide,
  getStudyGuides,
  getLearningPath,
  getLearningPaths,
} from "@/lib/content";
import { SKILL_FOCUS_AREAS } from "@/lib/skill-focus";
import { getTopicSlugsForPath } from "@/lib/topics";

export function generateStaticParams() {
  const guides = getStudyGuides().map((topic) => ({ slug: topic.slug }));
  const paths = getLearningPaths().map((path) => ({ slug: path.slug }));
  return [...guides, ...paths];
}

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getStudyGuide(slug);
  const path = getLearningPath(slug);

  if (!guide && !path) notFound();

  if (path) {
    const skillArea = SKILL_FOCUS_AREAS.find((s) => s.id === path.skillFocus);
    const topicSlugs = getTopicSlugsForPath(path.slug);

    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          render={<Link href="/study" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to study
        </Button>

        <header className="mb-8 border-b border-border pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {path.level && <span>{path.level}</span>}
            {path.level && path.duration && <span>·</span>}
            {path.duration && <span>{path.duration}</span>}
            {(path.level || path.duration) && <span>·</span>}
            <span>{path.certification}</span>
            <span>·</span>
            <span>
              {path.modules.length} module
              {path.modules.length !== 1 && "s"}
            </span>
          </div>

          {skillArea && (
            <span className="mb-3 inline-block rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
              {skillArea.title}
            </span>
          )}

          <h1 className="text-2xl font-semibold">{path.title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {path.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {path.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Modules</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Expand each module and click a topic to open detailed study notes.
          </p>
          <ModuleAccordion
            modules={path.modules}
            pathSlug={path.slug}
            topicSlugs={topicSlugs}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        render={<Link href="/study" />}
      >
        <ArrowLeft data-icon="inline-start" />
        Back to study
      </Button>

      <header className="mb-8 border-b border-border pb-8">
        <DomainBadge domain={guide!.domain} className="mb-3" />
        <h1 className="text-2xl font-semibold">{guide!.title}</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {guide!.description}
        </p>
      </header>

      <MarkdownContent content={guide!.content} />
    </div>
  );
}
