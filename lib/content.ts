import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  GuideFrontmatterSchema,
  LearningPathFrontmatterSchema,
  parseFrontmatter,
} from "./schemas";
import { bodyLineOffset } from "./topics";

export type LearningPath = z.infer<typeof LearningPathFrontmatterSchema> & { slug: string };

export type StudyGuide = z.infer<typeof GuideFrontmatterSchema> & {
  slug: string;
  content: string;
  /** Path of the source file from the repo root, for "Edit on GitHub". */
  repoPath: string;
  bodyLineOffset: number;
};

const STUDY_DIR = path.join(process.cwd(), "content", "study");
const PATHS_DIR = path.join(STUDY_DIR, "learning-paths");
const GUIDES_DIR = path.join(STUDY_DIR, "guides");

function readMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

let pathsCache: Map<string, LearningPath> | null = null;
let guidesCache: Map<string, StudyGuide> | null = null;

function loadPaths(): Map<string, LearningPath> {
  if (pathsCache) return pathsCache;
  const paths = readMdFiles(PATHS_DIR).map((file) => {
    const { data } = matter(fs.readFileSync(path.join(PATHS_DIR, file), "utf-8"));
    const fm = parseFrontmatter(LearningPathFrontmatterSchema, file, data);
    return { ...fm, slug: fm.slug ?? file.replace(/\.md$/, "") };
  });
  pathsCache = new Map(paths.sort((a, b) => a.order - b.order).map((p) => [p.slug, p]));
  return pathsCache;
}

function loadGuides(): Map<string, StudyGuide> {
  if (guidesCache) return guidesCache;
  const guides = readMdFiles(GUIDES_DIR).map((file) => {
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fm = parseFrontmatter(GuideFrontmatterSchema, file, data);
    return {
      ...fm,
      slug: file.replace(/\.md$/, ""),
      content,
      repoPath: `content/study/guides/${file}`,
      bodyLineOffset: bodyLineOffset(raw, content),
    };
  });
  guidesCache = new Map(guides.sort((a, b) => a.order - b.order).map((g) => [g.slug, g]));
  return guidesCache;
}

export function getLearningPaths(): LearningPath[] {
  return [...loadPaths().values()];
}

export function getLearningPath(slug: string): LearningPath | null {
  return loadPaths().get(slug) ?? null;
}

export function getStudyGuides(): StudyGuide[] {
  return [...loadGuides().values()];
}

export function getStudyGuide(slug: string): StudyGuide | null {
  return loadGuides().get(slug) ?? null;
}
