"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { loadSearchIndex, searchEntries, type SearchEntry } from "@/lib/search-index";

function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);

  useEffect(() => {
    loadSearchIndex().then(setIndex);
  }, []);

  const results = useMemo(() => (index ? searchEntries(index, query, 30) : []), [index, query]);

  return (
    <>
      <form
        role="search"
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <label htmlFor="q" className="sr-only">Search query</label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="KEDA, pgvector, dead-letter…"
          className="h-12 w-full rounded-md border border-border-strong bg-background px-4 text-base outline-none focus:border-primary"
        />
      </form>
      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {!index ? "Loading the index…" : query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Type to search."}
      </p>
      <ul className="mt-4 divide-y divide-border">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="group block py-3">
              <span className="font-medium text-foreground group-hover:text-primary">{r.heading ?? r.title}</span>
              <span className="block text-sm text-muted-foreground">{r.heading ? r.title : r.section}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SearchResults() {
  return (
    <Suspense fallback={null}>
      <Results />
    </Suspense>
  );
}
