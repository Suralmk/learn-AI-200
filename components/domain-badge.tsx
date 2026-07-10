import type { DomainId } from "@/lib/domains";
import { getDomain } from "@/lib/domains";
import { cn } from "@/lib/utils";

export function DomainBadge({
  domain,
  className,
}: {
  domain: DomainId;
  className?: string;
}) {
  const { title, weight } = getDomain(domain);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-[#2596be]" />
      {title}
      <span className="text-muted-foreground/70">({weight})</span>
    </span>
  );
}
