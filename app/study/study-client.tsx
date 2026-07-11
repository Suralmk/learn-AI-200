"use client";

import { useMemo, useState } from "react";
import type { LearningPath } from "@/lib/content";
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
  return (
    <Card>
      <CardHeader>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {path.level && <span>{path.level}</span>}
          {path.level && path.duration && <span>·</span>}
          {path.duration && <span>{path.duration}</span>}
          {(path.level || path.duration) && <span>·</span>}
          <span>{path.certification}</span>
        </div>
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
  const [filter, setFilter] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return paths;
    return paths.filter((p) => p.filterTags.includes(filter));
  }, [paths, filter]);

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
        <p className="mb-2 text-sm font-medium">Filter by topic</p>
        <div className="flex flex-wrap gap-2">
          <FilterTagButton
            tag="All"
            selected={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {filterTags.map((tag) => (
            <FilterTagButton
              key={tag}
              tag={tag}
              selected={filter === tag}
              onClick={() => setFilter(tag)}
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
