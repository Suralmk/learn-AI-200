import Link from "next/link";
import { PencilLine } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/doc/breadcrumbs";
import { MarkdownContent } from "@/components/markdown-content";
import { PrevNext } from "@/components/doc/prev-next";
import { TocPanel } from "@/components/doc/toc-panel";
import { VisitTracker } from "@/components/doc/visit-tracker";
import { getObjective } from "@/lib/exam-outline";
import { formatDate } from "@/lib/seo";
import { githubEditUrl } from "@/lib/site";
import { pageToc, stripTocSection } from "@/lib/toc";


/**
 * Layout for every Markdown study page: breadcrumbs, title, lead,
 * objectives, ~70ch body, "On this page" TOC, edit link and prev/next.
 */
export function DocPage({
  href,
  title,
  description,
  content,
  crumbs,
  repoPath,
  objectives = [],
  lastReviewed,
  prev,
  next,
}: {
  href: string;
  title: string;
  description?: string;
  content: string;
  crumbs: Crumb[];
  repoPath: string;
  objectives?: string[];
  lastReviewed?: string;
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  const body = stripTocSection(content);
  const toc = pageToc(body);
  const objectiveList = objectives.flatMap((id) => {
    const o = getObjective(id);
    return o ? [o] : [];
  });

  return (
    <div className="px-4 py-8 sm:px-8 lg:py-12 xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-12">
      <article className="min-w-0">
        <Breadcrumbs crumbs={crumbs} currentPath={href} />

        <header className="mb-10 max-w-[70ch]">
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h1>
          {description && <p className="mt-4 text-lg text-muted-foreground text-pretty">{description}</p>}
          {objectiveList.length > 0 && (
            <ul aria-label="Exam objectives covered" className="mt-6 flex flex-wrap gap-2">
              {objectiveList.map((o) => (
                <li key={o.id} className="max-w-full">
                  <Link
                    href={`/practice/${o.id}`}
                    className="inline-flex max-w-full items-center rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-medium text-primary-strong hover:border-primary/60"
                    title={`Practice: ${o.title}`}
                  >
                    <span className="truncate">{o.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <MarkdownContent content={body} />

        <footer className="mt-12 flex max-w-[70ch] flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          {lastReviewed && <p>Last reviewed {formatDate(lastReviewed)}</p>}
          <a
            href={githubEditUrl(repoPath)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <PencilLine className="size-4" aria-hidden />
            Edit this page on GitHub
          </a>
        </footer>

        <div className="max-w-[70ch]">
          <PrevNext prev={prev} next={next} />
        </div>
        <VisitTracker href={href} />
      </article>

      <aside className="hidden xl:block">
        <TocPanel items={toc} />
      </aside>
    </div>
  );
}
