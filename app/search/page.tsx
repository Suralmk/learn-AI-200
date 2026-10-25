import type { Metadata } from "next";
import { SearchResults } from "@/components/shell/search-results";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Search", description: "Search AI-200 Learn study notes by service, concept or heading.", path: "/search", type: "website" }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Search the notes</h1>
      <SearchResults />
    </div>
  );
}
