import type { ReactNode } from "react";
import { MarkdownContent } from "@/components/markdown-content";
import { StudyToc } from "@/components/study-toc";
import { extractToc, stripTocSection } from "@/lib/toc";

/**
 * Shared study content layout: markdown body + sticky right-side TOC.
 * Use on every markdown content page (topic notes, guides, etc.).
 */
export function StudyArticle({
  content,
  header,
}: {
  content: string;
  header?: ReactNode;
}) {
  const body = stripTocSection(content);
  const toc = extractToc(body);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {header}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <MarkdownContent content={body} />
        </article>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <StudyToc items={toc} />
          </aside>
        )}
      </div>
    </div>
  );
}
