import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DomainBadge } from "@/components/domain-badge";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { getStudyTopic, getStudyTopics } from "@/lib/content";

export function generateStaticParams() {
  return getStudyTopics().map((topic) => ({ slug: topic.slug }));
}

export default async function StudyTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getStudyTopic(slug);

  if (!topic) notFound();

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
        <DomainBadge domain={topic.domain} className="mb-3" />
        <h1 className="text-2xl font-semibold">{topic.title}</h1>
        <p className="mt-2 text-muted-foreground">{topic.description}</p>
      </div>

      <MarkdownContent content={topic.content} />
    </div>
  );
}
