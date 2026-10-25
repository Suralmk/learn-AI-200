import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = { title: string; href: string } | undefined;

export function PrevNext({ prev, next }: { prev: Item; next: Item }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Previous and next topic" className="mt-16 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </span>
          <span className="mt-1 block font-medium text-foreground group-hover:text-primary">{prev.title}</span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next && (
        <Link href={next.href} className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/50 sm:col-start-2">
          <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
            Next <ChevronRight className="size-4" aria-hidden />
          </span>
          <span className="mt-1 block font-medium text-foreground group-hover:text-primary">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
