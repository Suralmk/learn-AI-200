import type { MetadataRoute } from "next";
import { getLearningPaths, getStudyGuides } from "@/lib/content";
import { ALL_OBJECTIVES } from "@/lib/exam-outline";
import { EXAMS } from "@/lib/exams";
import { absoluteUrl } from "@/lib/seo";
import { getAllTopicNotes } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    priority,
    changeFrequency: "monthly",
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    entry("/", 1),
    entry("/study", 0.9),
    entry("/questions", 0.9),
    entry("/exam", 0.9),
    ...getLearningPaths().map((p) => entry(`/study/${p.slug}`, 0.8)),
    ...getStudyGuides().map((g) => entry(`/study/${g.slug}`, 0.7, g.last_reviewed)),
    ...getAllTopicNotes().map((n) => entry(n.href, 0.7, n.last_reviewed)),
    ...ALL_OBJECTIVES.map((o) => entry(`/practice/${o.id}`, 0.6)),
    ...EXAMS.map((e) => entry(`/exam/${e.id}`, 0.6)),
  ];
}
