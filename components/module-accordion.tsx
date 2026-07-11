"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LearningModule } from "@/lib/content";
import { getTopicSlug } from "@/lib/slugify";
import { cn } from "@/lib/utils";

export function ModuleAccordion({
  modules,
  pathSlug,
  topicSlugs,
}: {
  modules: LearningModule[];
  pathSlug: string;
  topicSlugs: string[];
}) {
  const slugSet = new Set(topicSlugs);

  return (
    <div className="divide-y divide-border">
      {modules.map((module, index) => (
        <details key={index} className="group">
          <summary className="flex cursor-pointer list-none items-start gap-3 py-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{module.name}</span>
                {module.duration && (
                  <span className="text-xs text-muted-foreground">
                    {module.duration}
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground group-open:hidden">
                {module.description}
              </p>
              <span className="mt-1 inline-block text-xs font-medium text-primary group-open:hidden">
                See more
              </span>
            </div>
            <ChevronDown
              className={cn(
                "mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                "group-open:rotate-180"
              )}
              aria-hidden
            />
          </summary>
          <div className="pb-4 pl-0">
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {module.description}
            </p>
            {module.topics.length > 0 ? (
              <ul className="space-y-1">
                {module.topics.map((topic) => {
                  const topicSlug = getTopicSlug(topic);
                  const hasNote = slugSet.has(topicSlug);

                  if (hasNote) {
                    return (
                      <li key={topicSlug}>
                        <Link
                          href={`/study/${pathSlug}/${topicSlug}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
                        >
                          <ChevronRight className="size-3.5 shrink-0" />
                          <span>{topic}</span>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={topicSlug}
                      className="flex gap-2 px-2 py-1.5 text-sm text-muted-foreground"
                    >
                      <span className="text-primary">•</span>
                      <span>{topic}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Content not yet available from source material
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
