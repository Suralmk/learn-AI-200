import { getLearningPaths, getStudyGuides, type LearningPath } from "./content";
import { SKILL_AREAS, type SkillAreaId } from "./exam-outline";
import { slugify } from "./slugify";
import { getTopicNotesForPath } from "./topics";

export interface NavTopic {
  title: string;
  href: string;
}

export interface NavModule {
  name: string;
  description: string;
  topics: NavTopic[];
}

export interface NavPath {
  slug: string;
  title: string;
  href: string;
  /** Topics in reading order (module order, then any unlisted files). */
  topics: NavTopic[];
  modules: NavModule[];
}

export interface NavArea {
  id: SkillAreaId;
  title: string;
  weight: string;
  paths: NavPath[];
  guides: NavTopic[];
}

let cache: NavArea[] | null = null;

/** Group a path's topic files by the module that lists their title; unlisted files go last. */
function buildPath(path: LearningPath): NavPath {
  const notes = new Map(getTopicNotesForPath(path.slug).map((n) => [n.slug, n]));
  const placed = new Set<string>();
  const toNav = (slug: string): NavTopic => ({ title: notes.get(slug)!.title, href: notes.get(slug)!.href });

  const modules = path.modules.map((m) => {
    const slugs = m.topics.map(slugify).filter((s) => notes.has(s) && !placed.has(s));
    slugs.forEach((s) => placed.add(s));
    return { name: m.name, description: m.description, topics: slugs.map(toNav) };
  });
  const extra = [...notes.keys()].filter((s) => !placed.has(s)).sort().map(toNav);

  return {
    slug: path.slug,
    title: path.title,
    href: `/study/${path.slug}`,
    topics: [...modules.flatMap((m) => m.topics), ...extra],
    modules,
  };
}

export function buildStudyNav(): NavArea[] {
  if (cache) return cache;
  const paths = new Map(getLearningPaths().map((p) => [p.slug, p]));
  const guides = getStudyGuides();

  cache = SKILL_AREAS.map((area) => ({
    id: area.id,
    title: area.title,
    weight: area.weight,
    paths: area.pathSlugs.flatMap((slug) => {
      const path = paths.get(slug);
      return path ? [buildPath(path)] : [];
    }),
    guides: guides.filter((g) => g.domain === area.id).map((g) => ({ title: g.title, href: `/study/${g.slug}` })),
  }));
  return cache;
}

export function getNavPath(slug: string): NavPath | undefined {
  return buildStudyNav()
    .flatMap((a) => a.paths)
    .find((p) => p.slug === slug);
}

export function getTopicNeighbors(pathSlug: string, href: string) {
  const topics = getNavPath(pathSlug)?.topics ?? [];
  const index = topics.findIndex((t) => t.href === href);
  return {
    prev: index > 0 ? topics[index - 1] : undefined,
    next: index >= 0 ? topics[index + 1] : undefined,
  };
}
