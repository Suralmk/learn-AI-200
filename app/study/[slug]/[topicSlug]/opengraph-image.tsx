import { getLearningPath } from "@/lib/content";
import { EXAM } from "@/lib/exam-outline";
import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getAllTopicParams, getTopicNote } from "@/lib/topics";

export const alt = `${EXAM.code} study notes`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTopicParams();
}

export default async function Image({ params }: { params: Promise<{ slug: string; topicSlug: string }> }) {
  const { slug, topicSlug } = await params;
  const note = getTopicNote(slug, topicSlug);
  const path = getLearningPath(slug);
  return renderOgImage({ title: note?.title ?? `${EXAM.code} study notes`, context: `${EXAM.code} study guide · ${path?.title ?? ""}` });
}
