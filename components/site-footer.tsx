import Link from "next/link";

const PORTFOLIO_URL = "https://sura.work";
const GITHUB_URL = "https://github.com/suralmk";

export function PreparedBy({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-sm text-muted-foreground"}>
      Prepared by{" "}
      <span className="font-medium text-foreground">Surafel Melaku</span>
      {" · "}
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        sura.work
      </a>
      {" · "}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        GitHub
      </a>
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <PreparedBy />
        <p className="text-xs text-muted-foreground">
          Study companion for{" "}
          <Link href="/" className="hover:text-foreground hover:underline">
            Learn AI-200
          </Link>
        </p>
      </div>
    </footer>
  );
}
