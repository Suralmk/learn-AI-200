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

export function generateStaticParams() {
  const guides = getStudyGuides().map((topic) => ({ slug: topic.slug }));
  const paths = getLearningPaths().map((path) => ({ slug: path.slug }));
  return [...guides, ...paths];
}

export default async function StudyTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getStudyGuide(slug);
  const path = getLearningPath(slug);

  if (!guide && !path) notFound();

  if (path) {
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

        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {path.level && <span>{path.level}</span>}
            {path.level && path.duration && <span>·</span>}
            {path.duration && <span>{path.duration}</span>}
            <span>·</span>
            <span>{path.certification}</span>
          </div>
          <h1 className="text-2xl font-semibold">{path.title}</h1>
          <p className="mt-2 text-muted-foreground">{path.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {path.filterTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <ModuleAccordion modules={path.modules} />
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

      <div className="mb-6">
        <DomainBadge domain={guide!.domain} className="mb-3" />
        <h1 className="text-2xl font-semibold">{guide!.title}</h1>
        <p className="mt-2 text-muted-foreground">{guide!.description}</p>
      </div>

      <MarkdownContent content={guide!.content} />
    </div>
  );
}
