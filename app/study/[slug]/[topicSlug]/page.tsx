import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import { getLearningPath } from "@/lib/content";
import { getAllTopicParams, getTopicNote } from "@/lib/topics";

export function generateStaticParams() {
  return getAllTopicParams();
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string; topicSlug: string }>;
}) {
  const { slug, topicSlug } = await params;
  const path = getLearningPath(slug);
  const note = getTopicNote(slug, topicSlug);

  if (!path || !note) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        render={<Link href={`/study/${slug}`} />}
      >
        <ArrowLeft data-icon="inline-start" />
        Back to {path.title}
      </Button>

      <p className="mb-2 text-xs text-muted-foreground">{note.moduleName}</p>
      <h1 className="mb-6 text-2xl font-semibold">{note.title}</h1>

      <MarkdownContent content={note.content} />
    </div>
  );
}
