import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export interface Crumb {
  label: string;
  /** Omit for the current page. */
  href?: string;
}

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD from one list. */
export function Breadcrumbs({ crumbs, currentPath, className }: { crumbs: Crumb[]; currentPath: string; className?: string }) {
  return (
    <>
      <BreadcrumbJsonLd crumbs={crumbs.map((c) => ({ name: c.label, path: c.href ?? currentPath }))} />
      <nav aria-label="Breadcrumb" className={className ?? "mb-6"}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
              {c.href ? (
                <Link href={c.href} className="hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
