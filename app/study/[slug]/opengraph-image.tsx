import { getLearningPath, getLearningPaths, getStudyGuide, getStudyGuides } from "@/lib/content";
import { EXAM } from "@/lib/exam-outline";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = `${EXAM.code} study notes`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return [...getLearningPaths(), ...getStudyGuides()].map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = getLearningPath(slug)?.title ?? getStudyGuide(slug)?.title ?? `${EXAM.code} study notes`;
  return renderOgImage({ title, context: `${EXAM.code} learning path` });
}
