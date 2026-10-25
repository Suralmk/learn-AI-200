import { EXAM } from "@/lib/exam-outline";
import { OG_SIZE, renderOgImage } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: free ${EXAM.code} study notes and practice questions`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({ title: `${EXAM.code} study guide and practice questions`, context: EXAM.certification });
}
