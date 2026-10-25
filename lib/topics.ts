import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { z } from "zod";
import { TopicFrontmatterSchema, parseFrontmatter } from "./schemas";

export type TopicNote = z.infer<typeof TopicFrontmatterSchema> & {
  slug: string;
  pathSlug: string;
  href: string;
  /** Path of the source file from the repo root, for "Edit on GitHub". */
  repoPath: string;
  content: string;
};

const TOPICS_DIR = path.join(process.cwd(), "content", "study", "topics");

export function topicHref(pathSlug: string, topicSlug: string): string {
  return `/study/${pathSlug}/${topicSlug}`;
}

let cache: Map<string, TopicNote> | null = null;

/** Every topic note, read and validated once per process, keyed by href. */
function loadTopics(): Map<string, TopicNote> {
  if (cache) return cache;
  cache = new Map();
  if (!fs.existsSync(TOPICS_DIR)) return cache;

  for (const pathSlug of fs.readdirSync(TOPICS_DIR).sort()) {
    const dir = path.join(TOPICS_DIR, pathSlug);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      const fm = parseFrontmatter(TopicFrontmatterSchema, `${pathSlug}/${file}`, data);
      const href = topicHref(pathSlug, slug);
      cache.set(href, { ...fm, slug, pathSlug, href, repoPath: `content/study/topics/${pathSlug}/${file}`, content });
    }
  }
  return cache;
}

export function getAllTopicNotes(): TopicNote[] {
  return [...loadTopics().values()];
}

export function getTopicNote(pathSlug: string, topicSlug: string): TopicNote | null {
  return loadTopics().get(topicHref(pathSlug, topicSlug)) ?? null;
}

export function getTopicNotesForPath(pathSlug: string): TopicNote[] {
  return getAllTopicNotes().filter((n) => n.pathSlug === pathSlug);
}

export function getAllTopicParams(): { slug: string; topicSlug: string }[] {
  return getAllTopicNotes().map((n) => ({ slug: n.pathSlug, topicSlug: n.slug }));
}

let byObjective: Map<string, TopicNote[]> | null = null;

/** Topic notes whose frontmatter lists the objective. */
export function getTopicNotesForObjective(objectiveId: string): TopicNote[] {
  if (!byObjective) {
    byObjective = new Map();
    for (const note of getAllTopicNotes()) {
      for (const id of note.objectives ?? []) {
        byObjective.set(id, [...(byObjective.get(id) ?? []), note]);
      }
    }
  }
  return byObjective.get(objectiveId) ?? [];
}
