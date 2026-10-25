"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Check, PanelLeft } from "lucide-react";
import type { NavArea, NavPath } from "@/lib/nav";
import { useProgress } from "@/lib/use-progress";
import { Meter } from "@/components/viz";
import { cn } from "@/lib/utils";

function PathGroup({ path, pathname, visited, idPrefix }: { path: NavPath; pathname: string; visited: Record<string, number>; idPrefix: string }) {
  const inPath = pathname === path.href || pathname.startsWith(`${path.href}/`);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? inPath;

  const read = path.topics.filter((t) => visited[t.href]).length;
  const id = `${idPrefix}nav-${path.slug}`;

  return (
    <li>
      <div className="flex items-start gap-1">
        <button
          type="button"
          onClick={() => setToggled(!open)}
          aria-expanded={open}
          aria-controls={id}
          aria-label={`${open ? "Collapse" : "Expand"} ${path.title}`}
          className="mt-1.5 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className={cn("size-4 transition-transform", open && "rotate-90")} />
        </button>
        <div className="min-w-0 flex-1">
          <Link
            href={path.href}
            aria-current={pathname === path.href ? "page" : undefined}
            className="block rounded-md px-1.5 py-1.5 text-sm leading-snug font-medium text-foreground hover:text-primary aria-[current=page]:text-primary"
          >
            {path.title}
          </Link>
          <div className="flex items-center gap-2 px-1.5 pb-1">
            <Meter value={read} max={path.topics.length} label={`${path.title} topics read`} className="h-1" />
            <span className="tabular shrink-0 text-[11px] text-muted-foreground">
              {read}/{path.topics.length}
            </span>
          </div>
        </div>
      </div>
      {open && (
        <ul id={id} className="mt-1 mb-2 ml-[1.1rem] space-y-px border-l border-border pl-2">
          {path.topics.map((t) => {
            const current = pathname === t.href;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug text-muted-foreground hover:bg-muted hover:text-foreground",
                    "aria-[current=page]:bg-primary-soft aria-[current=page]:font-medium aria-[current=page]:text-primary-strong"
                  )}
                >
                  <span className="min-w-0 flex-1">{t.title}</span>
                  {visited[t.href] && !current && (
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-label="read" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

/** idPrefix keeps ids unique when the tree renders twice (mobile disclosure + desktop column). */
function SidebarTree({ nav, idPrefix }: { nav: NavArea[]; idPrefix: string }) {
  const pathname = usePathname();
  const { visited } = useProgress();

  return (
    <nav aria-label="Study topics" className="space-y-7">
      {nav.map((area) => (
        <section key={area.id} aria-labelledby={`${idPrefix}area-${area.id}`}>
          <h2 id={`${idPrefix}area-${area.id}`} className="mb-2 flex items-baseline justify-between gap-2 px-1">
            <span className="text-sm font-semibold text-foreground">{area.title}</span>
            <span className="tabular text-xs text-muted-foreground">{area.weight}</span>
          </h2>
          <ul className="space-y-1">
            {area.paths.map((p) => (
              <PathGroup key={p.slug} path={p} pathname={pathname} visited={visited} idPrefix={idPrefix} />
            ))}
          </ul>
          {area.guides.length > 0 && (
            <ul className="mt-2 space-y-px pl-6">
              {area.guides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    aria-current={pathname === g.href ? "page" : undefined}
                    className="block rounded-md px-1.5 py-1 text-[13px] text-muted-foreground hover:text-foreground aria-[current=page]:text-primary"
                  >
                    Quick reference: {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </nav>
  );
}

/** Desktop: sticky column. Mobile: a disclosure above the content. */
export function Sidebar({ nav }: { nav: NavArea[] }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <>
      <div className="border-b border-border px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setOpenOn(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="mobile-study-nav"
          className="flex w-full items-center gap-2 rounded-md py-2 text-sm font-medium text-foreground"
        >
          <PanelLeft className="size-4 text-muted-foreground" aria-hidden />
          {open ? "Hide topics" : "Browse topics"}
        </button>
        {open && (
          <div id="mobile-study-nav" className="max-h-[70vh] overflow-y-auto pt-3 pb-4">
            <SidebarTree nav={nav} idPrefix="m-" />
          </div>
        )}
      </div>
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border px-4 py-8 lg:block">
        <SidebarTree nav={nav} idPrefix="d-" />
      </aside>
    </>
  );
}
