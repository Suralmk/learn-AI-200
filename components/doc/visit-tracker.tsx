"use client";

import { useEffect } from "react";
import { progressStore } from "@/lib/progress";

/** Marks a study page as read in local progress once it has been open for a few seconds. */
export function VisitTracker({ href }: { href: string }) {
  useEffect(() => {
    const t = window.setTimeout(() => progressStore.markVisited(href), 4000);
    return () => window.clearTimeout(t);
  }, [href]);
  return null;
}
