"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { FileText, Hash, Search as SearchIcon } from "lucide-react";
import { loadSearchIndex, searchEntries, type SearchEntry } from "@/lib/search-index";
import { cn } from "@/lib/utils";

export function Search({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !(e.target as HTMLElement).closest("input, textarea, [contenteditable]")) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && !index) loadSearchIndex().then(setIndex);
  }, [open, index]);

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  const results = useMemo(() => (index ? searchEntries(index, query, 10) : []), [index, query]);

  const go = useCallback(
    (entry: SearchEntry) => {
      setOpen(false);
      setQuery("");
      router.push(entry.href);
    },
    [router]
  );

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.max(0, Math.min(i + 1, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground",
          className
        )}
      >
        <SearchIcon className="size-4" aria-hidden />
        <span className="hidden sm:inline">Search notes</span>
        <span className="sr-only sm:hidden">Search notes</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 font-mono text-[11px] text-muted-foreground lg:inline">
          Ctrl K
        </kbd>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0" />
        <DialogPrimitive.Popup
          initialFocus={inputRef}
          className="fixed top-[12vh] left-1/2 z-50 w-[min(40rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-[0_24px_60px_-20px_rgb(14_23_38/0.35)] outline-none data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2"
        >
          <DialogPrimitive.Title className="sr-only">Search study notes</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Search topics, services and headings"
              className="h-13 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
              aria-autocomplete="list"
            />
          </div>
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
            {!index && <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading the index…</p>}
            {index && query.trim() === "" && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Type a service or concept, for example <span className="text-foreground">KEDA</span>,{" "}
                <span className="text-foreground">pgvector</span> or <span className="text-foreground">dead-letter</span>.
              </p>
            )}
            {index && query.trim() !== "" && results.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Nothing matches “{query}”. Try a shorter word or a service name.
              </p>
            )}
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((r, i) => (
                <li
                  key={r.href}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5",
                    i === active && "bg-primary-soft"
                  )}
                >
                  {r.heading ? (
                    <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  ) : (
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {r.heading ?? r.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.heading ? r.title : r.section}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
