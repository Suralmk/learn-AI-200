"use client";

import { ChevronDown } from "lucide-react";
import type { LearningModule } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ModuleAccordion({ modules }: { modules: LearningModule[] }) {
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
              <ul className="space-y-1 text-sm text-muted-foreground">
                {module.topics.map((topic, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
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
