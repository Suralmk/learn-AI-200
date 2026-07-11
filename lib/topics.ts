import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugify } from "./slugify";

export interface TopicNote {
  slug: string;
  title: string;
  pathSlug: string;
  moduleName: string;
  content: string;
}

const TOPICS_DIR = path.join(process.cwd(), "content", "study", "topics");

export function getTopicNote(
  pathSlug: string,
  topicSlug: string
): TopicNote | null {
  const filePath = path.join(TOPICS_DIR, pathSlug, `${topicSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug: topicSlug,
    title: data.title as string,
    pathSlug: data.pathSlug as string,
    moduleName: data.moduleName as string,
    content,
  };
}

export function getTopicSlugsForPath(pathSlug: string): string[] {
  const dir = path.join(TOPICS_DIR, pathSlug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function topicNoteExists(
  pathSlug: string,
  topicTitle: string
): boolean {
  const topicSlug = slugify(topicTitle);
  return fs.existsSync(path.join(TOPICS_DIR, pathSlug, `${topicSlug}.md`));
}


export function getAllTopicParams(): { slug: string; topicSlug: string }[] {
  if (!fs.existsSync(TOPICS_DIR)) return [];

  const params: { slug: string; topicSlug: string }[] = [];

  for (const pathSlug of fs.readdirSync(TOPICS_DIR)) {
    const dir = path.join(TOPICS_DIR, pathSlug);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      params.push({
        slug: pathSlug,
        topicSlug: file.replace(/\.md$/, ""),
      });
    }
  }

  return params;
}
