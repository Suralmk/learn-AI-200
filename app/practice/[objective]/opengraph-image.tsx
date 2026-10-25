import { ALL_OBJECTIVES, EXAM, getObjective } from "@/lib/exam-outline";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = `${EXAM.code} practice questions`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_OBJECTIVES.map((o) => ({ objective: o.id }));
}

export default async function Image({ params }: { params: Promise<{ objective: string }> }) {
  const { objective } = await params;
  const o = getObjective(objective);
  return renderOgImage({ title: o ? o.title : `${EXAM.code} practice`, context: `${EXAM.code} practice questions with explanations` });
}
