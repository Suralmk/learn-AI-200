import Link from "next/link";
import { ALL_OBJECTIVES } from "@/lib/exam-outline";
import { getLearningPaths } from "@/lib/content";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">This page isn’t here</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The link may be old or mistyped. Search the notes with <kbd className="rounded border border-border bg-surface px-1.5 font-mono text-sm">Ctrl K</kbd>, or go to one of these:
      </p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {[
          ["/study", "Study notes", `All ${getLearningPaths().length} learning paths by skill area`],
          ["/questions", "Practice questions", `Questions for each of the ${ALL_OBJECTIVES.length} objectives`],
          ["/exam", "Mock exams", "Full-length and focused tests"],
        ].map(([href, label, hint]) => (
          <li key={href}>
            <Link href={href} className="group block py-4">
              <span className="font-medium text-foreground group-hover:text-primary">{label}</span>
              <span className="block text-sm text-muted-foreground">{hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
