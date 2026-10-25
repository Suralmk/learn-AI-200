import { getLearningPaths, getStudyGuides } from "./content";
import { ALL_OBJECTIVES } from "./exam-outline";
import { getAllQuestions, readObjectiveMap } from "./questions";
import { getAllTopicNotes } from "./topics";

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
  const topics = guard(getAllTopicNotes) ?? [];

  const routes = new Set<string>([
    ...paths.map((p) => `/study/${p.slug}`),
    ...guides.map((g) => `/study/${g.slug}`),
    ...topics.map((t) => t.href),
  ]);

  for (const note of topics) {
    merge(checkMarkdown(note.repoPath, note.content, routes, { template: true }));
    if (!note.description) report.warnings.push(`${note.repoPath}: missing description`);
  }
  for (const guide of guides) {
    merge(checkMarkdown(guide.repoPath, guide.content, routes));
  }

  const ids = new Set((guard(getAllQuestions) ?? []).map((q) => q.id));
  const objectives = new Set(ALL_OBJECTIVES.map((o) => o.id));
  for (const [id, objective] of Object.entries(readObjectiveMap())) {
    if (!ids.has(id)) report.errors.push(`objective-map.json: unknown question ${id}`);
    if (!objectives.has(objective)) report.errors.push(`objective-map.json: unknown objective ${objective}`);
  }

  return report;
}
