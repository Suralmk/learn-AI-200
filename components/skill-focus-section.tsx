import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SKILL_FOCUS_AREAS } from "@/lib/skill-focus";

export function SkillFocusSection({
  showLinks = true,
}: {
  showLinks?: boolean;
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold">
        Important skills to focus on
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Four core skill areas for the AI-200 exam — all covered in the study
        materials below.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {SKILL_FOCUS_AREAS.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <div className="mb-1 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <CardTitle className="text-base leading-snug">
                  {area.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {area.description}
              </CardDescription>
            </CardHeader>
            {showLinks && (
              <CardContent>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {area.pathSlugs.length} learning path
                  {area.pathSlugs.length !== 1 && "s"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.pathSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/study/${slug}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View →
                    </Link>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
