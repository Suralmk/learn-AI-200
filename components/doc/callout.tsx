import { AlertTriangle, Info, Lightbulb, OctagonAlert, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutKind = "note" | "tip" | "warning" | "important" | "caution";

const KINDS: Record<CalloutKind, { label: string; Icon: typeof Info; tone: string; icon: string }> = {
  note: { label: "Note", Icon: Info, tone: "border-border bg-surface", icon: "text-muted-foreground" },
  tip: { label: "Tip", Icon: Lightbulb, tone: "border-primary/25 bg-primary-soft", icon: "text-primary-strong" },
  // Warnings are reserved for exam traps in study notes.
  warning: { label: "Exam trap", Icon: AlertTriangle, tone: "border-coral/35 bg-coral-soft", icon: "text-coral-ink" },
  important: { label: "Important", Icon: Star, tone: "border-primary/25 bg-primary-soft", icon: "text-primary-strong" },
  caution: { label: "Caution", Icon: OctagonAlert, tone: "border-danger/30 bg-danger-soft", icon: "text-danger" },
};

export function Callout({ kind, children }: { kind: CalloutKind; children: React.ReactNode }) {
  const { label, Icon, tone, icon } = KINDS[kind] ?? KINDS.note;
  return (
    <aside
      role="note"
      aria-label={label}
      className={cn("not-prose my-6 flex gap-3 rounded-lg border px-4 py-3.5 text-base leading-relaxed", tone)}
    >
      <Icon className={cn("mt-1 size-4 shrink-0", icon)} aria-hidden />
      <div className="callout-body min-w-0 space-y-2 text-foreground/90">
        <p className={cn("text-sm font-semibold", icon)}>{label}</p>
        {children}
      </div>
    </aside>
  );
}
