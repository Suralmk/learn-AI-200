import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPage } from "@/components/doc/doc-page";
import { TopicJsonLd } from "@/components/seo/json-ld";
import { getLearningPath } from "@/lib/content";
import { EXAM, getAreaForPath } from "@/lib/exam-outline";
import { getTopicNeighbors } from "@/lib/nav";
import { pageMetadata } from "@/lib/seo";
import { getAllTopicParams, getTopicNote } from "@/lib/topics";

type Props = { params: Promise<{ slug: string; topicSlug: string }> };

export function generateStaticParams() {
  return getAllTopicParams();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, topicSlug } = await params;
  const path = getLearningPath(slug);
  const note = getTopicNote(slug, topicSlug);
  if (!path || !note) return {};

  return pageMetadata({
    title: note.title,
    description:
      note.description ??
      `${note.title}: ${EXAM.code} study notes for ${note.moduleName}, with CLI and Python examples, exam traps and practice questions.`,
    path: `/study/${slug}/${topicSlug}`,
  });
}

export default async function TopicPage({ params }: Props) {
  const { slug, topicSlug } = await params;
  const path = getLearningPath(slug);
  const note = getTopicNote(slug, topicSlug);
  if (!path || !note) notFound();

  const area = getAreaForPath(slug);
  const { href } = note;
  const { prev, next } = getTopicNeighbors(slug, href);

  return (
    <>
      <TopicJsonLd
        title={note.title}
        description={note.description}
        path={href}
        areaTitle={area?.officialTitle}
        lastReviewed={note.last_reviewed}
      />
      <DocPage
        href={href}
        title={note.title}
        description={note.description}
        content={note.content}
        crumbs={[
          { label: "Study", href: "/study" },
          { label: path.title, href: `/study/${slug}` },
          { label: note.title },
        ]}
        repoPath={note.repoPath}
        objectives={note.objectives}
        lastReviewed={note.last_reviewed}
        prev={prev}
        next={next}
      />
    </>
  );
}
