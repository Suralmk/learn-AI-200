"use client";

import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { GithubStarButton } from "@/components/shell/github-link";
import { Button } from "@/components/ui/button";
import { CONTRIBUTING_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "ai200-learn:star-dismissed";

const subscribeNoop = () => () => {};
function readDismissed() {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * "If this helped, star the repo" prompt. The section variant always shows;
 * the card variant can be dismissed and stays dismissed in this browser.
 */
export function StarPrompt({ variant = "card", className }: { variant?: "card" | "section"; className?: string }) {
  const stored = useSyncExternalStore(subscribeNoop, readDismissed, () => true);
  const [dismissedNow, setDismissedNow] = useState(false);
  const hidden = variant === "card" && (stored || dismissedNow);

  if (hidden) return null;

  function dismiss() {
    setDismissedNow(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable: hide for this page view only.
    }
  }

  return (
    <aside
      aria-label="Support the project"
      className={cn(
        "relative flex flex-col gap-5 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between",
        variant === "section" && "sm:p-8",
        className
      )}
    >
      <div className="max-w-[60ch] pr-8 sm:pr-0">
        <p className="text-lg font-semibold text-foreground">If this helped, star the repo</p>
        <p className="mt-1 text-muted-foreground">
          Stars help other candidates find these notes. Spotted a mistake or want to add a question?{" "}
          <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
            Contribute on GitHub
          </a>
          .
        </p>
      </div>
      <GithubStarButton label="Star on GitHub" className="self-start sm:self-auto" />
      {variant === "card" && (
        <Button variant="ghost" size="icon-sm" onClick={dismiss} aria-label="Dismiss" className="absolute top-3 right-3 text-muted-foreground">
          <X />
        </Button>
      )}
    </aside>
  );
}
