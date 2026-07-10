import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMAINS } from "@/lib/domains";
import { getStudyTopics, getStudyTopicsByDomain } from "@/lib/content";

export default function StudyPage() {
  const topics = getStudyTopics();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Study materials</h1>
        <p className="text-muted-foreground">
          Notes organized by AI-200 exam domain. Each guide includes concepts,
          exam tips, and code samples (Python &amp; Azure CLI).
        </p>
      </div>

      {DOMAINS.map((domain) => {
        const domainTopics = getStudyTopicsByDomain(domain.id);
        if (domainTopics.length === 0) return null;

        return (
          <section key={domain.id} className="mb-10">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{domain.title}</h2>
              <p className="text-sm text-muted-foreground">
                {domain.weight} · {domain.description}
              </p>
            </div>
            <div className="grid gap-3">
              {domainTopics.map((topic) => (
                <Link key={topic.slug} href={`/study/${topic.slug}`}>
                  <Card className="transition-colors hover:border-primary/50">
                    <CardHeader className="!flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {topic.description}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {topics.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No study materials yet. Add markdown files to{" "}
            <code className="text-sm">content/study/</code>.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
