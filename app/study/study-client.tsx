"use client";

import { useMemo, useState } from "react";
import type { LearningPath } from "@/lib/content";
import type { SkillFocusId } from "@/lib/skill-focus";
import { SKILL_FOCUS_AREAS } from "@/lib/skill-focus";
import { ModuleAccordion } from "@/components/module-accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
      {tag}
    </span>
  );
}

function FilterTagButton({
  tag,
  selected,
  onClick,
}: {
  tag: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="capitalize"
    >
      {tag}
    </Button>
  );
}

function LearningPathCard({ path }: { path: LearningPath }) {
  const skillArea = SKILL_FOCUS_AREAS.find((s) => s.id === path.skillFocus);

  return (
    <Card id={path.slug}>
      <CardHeader>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {path.level && <span>{path.level}</span>}
          {path.level && path.duration && <span>·</span>}
          {path.duration && <span>{path.duration}</span>}
          {(path.level || path.duration) && <span>·</span>}
          <span>{path.certification}</span>
        </div>
        {skillArea && (
          <span className="mb-2 inline-block rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
            {skillArea.title}
          </span>
        )}
        <CardTitle className="text-lg">{path.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {path.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {path.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {path.filterTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-medium">Modules</p>
        <ModuleAccordion modules={path.modules} />
      </CardContent>
    </Card>
  );
}

export default function StudyClient({
  paths,
  filterTags,
  areas,
}: {
  paths: LearningPath[];
  filterTags: string[];
  areas: string[];
}) {
  const [tagFilter, setTagFilter] = useState<string | "all">("all");
  const [skillFilter, setSkillFilter] = useState<SkillFocusId | "all">("all");

  const filtered = useMemo(() => {
    return paths.filter((p) => {
      const matchesTag =
        tagFilter === "all" || p.filterTags.includes(tagFilter);
      const matchesSkill =
        skillFilter === "all" || p.skillFocus === skillFilter;
      return matchesTag && matchesSkill;
    });
  }, [paths, tagFilter, skillFilter]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Study materials</h1>
        <p className="text-muted-foreground">
          Official Microsoft Learn AI-200 learning paths. Expand each module to
          see full details and sub-topics.
        </p>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-medium">Filter by skill area</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterTagButton
            tag="All skills"
            selected={skillFilter === "all"}
            onClick={() => setSkillFilter("all")}
          />
          {SKILL_FOCUS_AREAS.map((area) => (
            <FilterTagButton
              key={area.id}
              tag={area.title.split(" & ")[0]}
              selected={skillFilter === area.id}
              onClick={() => setSkillFilter(area.id)}
            />
          ))}
        </div>
        <p className="mb-2 text-sm font-medium">Filter by topic</p>
        <div className="flex flex-wrap gap-2">
          <FilterTagButton
            tag="All"
            selected={tagFilter === "all"}
            onClick={() => setTagFilter("all")}
          />
          {filterTags.map((tag) => (
            <FilterTagButton
              key={tag}
              tag={tag}
              selected={tagFilter === tag}
              onClick={() => setTagFilter(tag)}
            />
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} learning path
        {filtered.length !== 1 && "s"}
      </p>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No learning paths match this filter.
            </CardContent>
          </Card>
        ) : (
          filtered.map((path) => (
            <LearningPathCard key={path.slug} path={path} />
          ))
        )}
      </div>

      <section className="mt-12 rounded-lg border border-border p-6">
        <h2 className="mb-2 text-lg font-semibold">Areas covered</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All topics across the AI-200 learning paths.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {areas.map((area) => (
            <TagPill key={area} tag={area} />
          ))}
        </div>
      </section>
    </div>
  );
}
