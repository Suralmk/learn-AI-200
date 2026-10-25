import fs from "fs";
import path from "path";
import { getLearningPaths, getStudyGuides } from "./content";
import { ALL_OBJECTIVES } from "./exam-outline";
import { getAllQuestions } from "./questions";
import { getAllTopicParams, getTopicNote } from "./topics";

/** H2 sections every topic page should have (see CLAUDE.md → Content rules). */
export const TEMPLATE_SECTIONS = [
  "What this covers",
  "Key concepts",
  "How it works",
  "Hands-on",
  "Exam traps",
  "Quick review",
  "Practice",
  "Official references",
] as const;

export interface Report {
  errors: string[];
  warnings: string[];
}

export function checkMarkdown(
  file: string,
  body: string,
  routes: Set<string>,
  opts: { template?: boolean } = {}
): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const headings: string[] = [];
  let inFence = false;

  body.split(/\r?\n/).forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    const fence = /^\s*(```+|~~~+)(.*)$/.exec(line);
    if (fence) {
      if (!inFence && !fence[2].trim()) errors.push(`${at}: code fence without a language`);
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    if (/^#\s/.test(line)) errors.push(`${at}: H1 in body (the page renders the title as H1)`);
    const h2 = /^##\s+(.+?)\s*#*$/.exec(line);
    if (h2) headings.push(h2[1].toLowerCase());

    for (const m of line.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)) {
      const target = m[1].replace(/\/$/, "") || "/";
      if (target.startsWith("/study/") && !routes.has(target)) {
        errors.push(`${at}: broken internal link ${target}`);
      }
    }
  });

  if (opts.template) {
    for (const section of TEMPLATE_SECTIONS) {
      if (!headings.some((h) => h.startsWith(section.toLowerCase()))) {
        warnings.push(`${file}: missing section "${section}"`);
      }
    }
  }

  return { errors, warnings };
}

export function validateContent(): Report {
  const report: Report = { errors: [], warnings: [] };
  const merge = (r: Report) => {
    report.errors.push(...r.errors);
    report.warnings.push(...r.warnings);
  };
  const guard = <T>(fn: () => T): T | undefined => {
    try {
      return fn();
    } catch (e) {
      report.errors.push((e as Error).message);
      return undefined;
    }
  };

  const paths = guard(getLearningPaths) ?? [];
  const guides = guard(getStudyGuides) ?? [];
  const topics = getAllTopicParams();

  const routes = new Set<string>([
    ...paths.map((p) => `/study/${p.slug}`),
    ...guides.map((g) => `/study/${g.slug}`),
    ...topics.map((t) => `/study/${t.slug}/${t.topicSlug}`),
  ]);

  for (const { slug, topicSlug } of topics) {
    const note = guard(() => getTopicNote(slug, topicSlug));
    if (!note) continue;
    const file = `content/study/topics/${slug}/${topicSlug}.md`;
    merge(checkMarkdown(file, note.content, routes, { template: true }));
    if (!note.description) report.warnings.push(`${file}: missing description`);
  }
  for (const guide of guides) {
    merge(checkMarkdown(`content/study/guides/${guide.slug}.md`, guide.content, routes));
  }

  const questions = guard(getAllQuestions) ?? [];
  const mapFile = path.join(process.cwd(), "content", "questions", "objective-map.json");
  if (fs.existsSync(mapFile)) {
    const map = JSON.parse(fs.readFileSync(mapFile, "utf-8")) as Record<string, string>;
    const ids = new Set(questions.map((q) => q.id));
    const objectives = new Set(ALL_OBJECTIVES.map((o) => o.id));
    for (const [id, objective] of Object.entries(map)) {
      if (!ids.has(id)) report.errors.push(`objective-map.json: unknown question ${id}`);
      if (!objectives.has(objective)) report.errors.push(`objective-map.json: unknown objective ${objective}`);
    }
  }

  return report;
}
