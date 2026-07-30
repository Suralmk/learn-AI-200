import type { MetadataRoute } from "next";
import { getLearningPaths, getStudyGuides } from "@/lib/content";
import { EXAMS } from "@/lib/exams";
import { SITE_URL } from "@/lib/site";
import { getAllTopicParams } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/study`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/questions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/exam`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const studyPages: MetadataRoute.Sitemap = [
    ...getLearningPaths().map((path) => ({
      url: `${SITE_URL}/study/${path.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getStudyGuides().map((guide) => ({
      url: `${SITE_URL}/study/${guide.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const topicPages: MetadataRoute.Sitemap = getAllTopicParams().map(
    ({ slug, topicSlug }) => ({
      url: `${SITE_URL}/study/${slug}/${topicSlug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  const examPages: MetadataRoute.Sitemap = EXAMS.map((exam) => ({
    url: `${SITE_URL}/exam/${exam.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...studyPages, ...topicPages, ...examPages];
}
