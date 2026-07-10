"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { DomainFilter } from "@/components/domain-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyTopic } from "@/lib/content";
import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";

function TopicCard({ topic }: { topic: StudyTopic }) {
  return (
    <Link href={`/study/${topic.slug}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader className="!flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{topic.title}</CardTitle>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function StudyClient({ topics }: { topics: StudyTopic[] }) {
  const [filter, setFilter] = useState<DomainId | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return topics;
    return topics.filter((t) => t.domain === filter);
  }, [topics, filter]);

  const visibleDomains = useMemo(() => {
    if (filter === "all") return DOMAINS;
    return DOMAINS.filter((d) => d.id === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Study materials</h1>
        <p className="text-muted-foreground">
          Notes organized by AI-200 exam domain. Each guide includes concepts,
          exam tips, and code samples (Python &amp; Azure CLI).
        </p>
      </div>

      <div className="mb-6">
        <DomainFilter
          domains={DOMAINS.map((d) => d.id)}
          selected={filter}
          onChange={setFilter}
        />
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} topic{filtered.length !== 1 && "s"}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No study materials for this domain yet.
          </CardContent>
        </Card>
      ) : (
        visibleDomains.map((domain) => {
          const domainTopics = filtered.filter((t) => t.domain === domain.id);
          if (domainTopics.length === 0) return null;

          return (
            <section key={domain.id} className="mb-10 last:mb-0">
              {filter === "all" && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{domain.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {domain.weight} · {domain.description}
                  </p>
                </div>
              )}
              <div className="grid gap-3">
                {domainTopics.map((topic) => (
                  <TopicCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
