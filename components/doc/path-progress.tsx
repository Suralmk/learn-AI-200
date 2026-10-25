"use client";

import { Check } from "lucide-react";
import { Meter } from "@/components/viz";
import { useProgress } from "@/lib/use-progress";

export function PathProgress({ hrefs, label }: { hrefs: string[]; label: string }) {
  const { visited } = useProgress();
  const read = hrefs.filter((h) => visited[h]).length;
  return (
    <div className="flex min-w-48 items-center gap-3">
      <Meter value={read} max={hrefs.length} label={`${label}: topics read`} className="w-32" />
      <span className="tabular text-sm text-muted-foreground">
        {read} of {hrefs.length} read
      </span>
    </div>
  );
}

export function TopicReadMark({ href }: { href: string }) {
  const { visited } = useProgress();
  return visited[href] ? (
    <Check className="size-4 shrink-0 text-success" aria-label="Read" />
  ) : (
    <span className="size-4 shrink-0 rounded-full border border-border-strong" aria-hidden />
  );
}
