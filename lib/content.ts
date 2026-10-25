import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DomainId } from "./domains";
import type { SkillFocusId } from "./skill-focus";
import {
  GuideFrontmatterSchema,
  LearningPathFrontmatterSchema,
  parseFrontmatter,
} from "./schemas";

export interface LearningModule {
  name: string;
  duration: string;
  description: string;
  topics: string[];
}

export interface LearningPath {
  slug: string;
  title: string;
  certification: string;
  duration: string;
  level: string;
  description: string;
  tags: string[];
  filterTags: string[];
  skillFocus: SkillFocusId;
  modules: LearningModule[];
  order: number;
}

export interface StudyGuide {
  slug: string;
  title: string;
  domain: DomainId;
  description: string;
  order: number;
  content: string;
  last_reviewed?: string;
  source_version?: string;
  objectives?: string[];
}

/** @deprecated Use StudyGuide — kept for backward compatibility */
export type StudyTopic = StudyGuide;

const STUDY_DIR = path.join(process.cwd(), "content", "study");
const PATHS_DIR = path.join(STUDY_DIR, "learning-paths");
const GUIDES_DIR = path.join(STUDY_DIR, "guides");

function readMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function parseLearningPath(filename: string): LearningPath | null {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(PATHS_DIR, filename), "utf-8");
  const { data } = matter(raw);

  if (!data.modules) return null;

  const fm = parseFrontmatter(LearningPathFrontmatterSchema, filename, data);
  return { ...fm, slug: fm.slug ?? slug };
}

function parseStudyGuide(filename: string): StudyGuide | null {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(GUIDES_DIR, filename), "utf-8");
  const { data, content } = matter(raw);

  if (data.modules) return null;

  const fm = parseFrontmatter(GuideFrontmatterSchema, filename, data);
  return { ...fm, slug, content };
}

export function getLearningPaths(): LearningPath[] {
  return readMdFiles(PATHS_DIR)
    .map(parseLearningPath)
    .filter((p): p is LearningPath => p !== null)
    .sort((a, b) => a.order - b.order);
}

export function getLearningPath(slug: string): LearningPath | null {
  const filePath = path.join(PATHS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return getLearningPaths().find((p) => p.slug === slug) ?? null;
  }
  return parseLearningPath(`${slug}.md`);
}

export function getStudyGuides(): StudyGuide[] {
  return readMdFiles(GUIDES_DIR)
    .map(parseStudyGuide)
    .filter((g): g is StudyGuide => g !== null)
    .sort((a, b) => a.order - b.order);
}

export function getStudyGuide(slug: string): StudyGuide | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  return parseStudyGuide(`${slug}.md`);
}

export function getAllFilterTags(): string[] {
  const tags = new Set<string>();
  getLearningPaths().forEach((p) => p.filterTags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getAllAreas(): string[] {
  const areas = new Set<string>();
  getLearningPaths().forEach((p) => p.tags.forEach((t) => areas.add(t)));
  return Array.from(areas).sort();
}

/** @deprecated Use getStudyGuides */
export function getStudyTopics(): StudyGuide[] {
  return getStudyGuides();
}

/** @deprecated Use getStudyGuide */
export function getStudyTopic(slug: string): StudyGuide | null {
  return getStudyGuide(slug);
}

export function getStudyTopicsByDomain(domain: DomainId): StudyGuide[] {
  return getStudyGuides().filter((t) => t.domain === domain);
}
