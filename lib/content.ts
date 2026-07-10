import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DomainId } from "./domains";

export interface StudyTopic {
  slug: string;
  title: string;
  domain: DomainId;
  description: string;
  order: number;
  content: string;
}

const STUDY_DIR = path.join(process.cwd(), "content", "study");

export function getStudyTopics(): StudyTopic[] {
  if (!fs.existsSync(STUDY_DIR)) return [];

  const files = fs
    .readdirSync(STUDY_DIR)
    .filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(STUDY_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title as string,
        domain: data.domain as DomainId,
        description: data.description as string,
        order: (data.order as number) ?? 99,
        content,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getStudyTopic(slug: string): StudyTopic | null {
  const filePath = path.join(STUDY_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    domain: data.domain as DomainId,
    description: data.description as string,
    order: (data.order as number) ?? 99,
    content,
  };
}

export function getStudyTopicsByDomain(domain: DomainId): StudyTopic[] {
  return getStudyTopics().filter((t) => t.domain === domain);
}
