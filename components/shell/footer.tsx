import Link from "next/link";
import { EXAM } from "@/lib/exam-outline";
import { AUTHOR, CONTENT_LICENSE_URL, CONTRIBUTING_URL, GITHUB_REPO_URL, NOT_AFFILIATED_NOTICE, SITE_NAME, githubBlobUrl } from "@/lib/site";
import { GithubLink } from "./github-link";

const COLUMNS = [
  {
    title: "Study",
    links: [
      { href: "/study", label: "All study notes" },
      { href: "/questions", label: "Practice by objective" },
      { href: "/exam", label: "Mock exams" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: CONTRIBUTING_URL, label: "Contribute a question" },
      { href: `${GITHUB_REPO_URL}/issues/new/choose`, label: "Report a content error" },
      { href: GITHUB_REPO_URL, label: "Source on GitHub" },
    ],
  },
  {
    title: "Official sources",
    links: [
      { href: EXAM.studyGuideUrl, label: "AI-200 study guide" },
      { href: EXAM.certificationUrl, label: "Certification page" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm space-y-3">
          <p className="text-sm font-semibold text-foreground">{SITE_NAME}</p>
          <p className="text-sm text-muted-foreground">
            Free, open-source study notes and practice for Exam {EXAM.code}: {EXAM.title}. Built by{" "}
            <a href={AUTHOR.url} className="text-foreground underline decoration-border-strong hover:decoration-foreground" target="_blank" rel="noopener noreferrer">
              {AUTHOR.name}
            </a>{" "}
            and contributors.
          </p>
          <GithubLink className="text-sm font-medium text-primary hover:underline">Star the repository</GithubLink>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="mb-3 text-sm font-semibold text-foreground">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("/") ? (
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:justify-between">
          <p>{NOT_AFFILIATED_NOTICE}</p>
          <p>
            Code under{" "}
            <a href={githubBlobUrl("LICENSE")} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">MIT</a>
            , notes and questions under{" "}
            <a href={CONTENT_LICENSE_URL} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
