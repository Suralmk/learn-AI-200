"use client";

import type { DomainId } from "@/lib/domains";
import { DOMAINS } from "@/lib/domains";
import { Button } from "@/components/ui/button";

export function DomainFilter({
  domains,
  selected,
  onChange,
}: {
  domains: DomainId[];
  selected: DomainId | "all";
  onChange: (domain: DomainId | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("all")}
      >
        All
      </Button>
      {domains.map((id) => {
        const domain = DOMAINS.find((d) => d.id === id)!;
        return (
          <Button
            key={id}
            variant={selected === id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(id)}
          >
            {domain.title}
          </Button>
        );
      })}
    </div>
  );
}
