"use client";

import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, { label: string; prismLanguage: string }> =
  {
    json: { label: "JSON", prismLanguage: "json" },
    yaml: { label: "YAML", prismLanguage: "yaml" },
    yml: { label: "YAML", prismLanguage: "yaml" },
    bicep: { label: "Bicep", prismLanguage: "bicep" },
    dockerfile: { label: "Dockerfile", prismLanguage: "docker" },
    docker: { label: "Dockerfile", prismLanguage: "docker" },
    python: { label: "Python", prismLanguage: "python" },
    py: { label: "Python", prismLanguage: "python" },
    bash: { label: "Azure CLI / Bash", prismLanguage: "bash" },
    sh: { label: "Azure CLI / Bash", prismLanguage: "bash" },
    shell: { label: "Shell", prismLanguage: "bash" },
    powershell: { label: "PowerShell", prismLanguage: "powershell" },
    ps1: { label: "PowerShell", prismLanguage: "powershell" },
    ps: { label: "PowerShell", prismLanguage: "powershell" },
    csharp: { label: "C#", prismLanguage: "csharp" },
    cs: { label: "C#", prismLanguage: "csharp" },
    sql: { label: "SQL", prismLanguage: "sql" },
    kusto: { label: "KQL", prismLanguage: "sql" },
    kql: { label: "KQL", prismLanguage: "sql" },
    javascript: { label: "JavaScript", prismLanguage: "javascript" },
    js: { label: "JavaScript", prismLanguage: "javascript" },
    typescript: { label: "TypeScript", prismLanguage: "typescript" },
    ts: { label: "TypeScript", prismLanguage: "typescript" },
    env: { label: "Env", prismLanguage: "bash" },
    html: { label: "HTML", prismLanguage: "markup" },
    xml: { label: "XML", prismLanguage: "markup" },
    markdown: { label: "Markdown", prismLanguage: "markdown" },
    md: { label: "Markdown", prismLanguage: "markdown" },
    text: { label: "Code", prismLanguage: "text" },
  };

function autoDetectLanguage(code: string, language?: string): string {
  if (language && language !== "text" && language !== "code" && language !== "") {
    return language;
  }
  const trimmed = code.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return "json";
  }
  if (/^(FROM|RUN|COPY|WORKDIR|CMD|ENTRYPOINT|ENV|EXPOSE)\s/i.test(trimmed)) {
    return "dockerfile";
  }
  if (/^(az|kubectl|docker|pip|npm|git|curl|export|cd|mkdir)\s/i.test(trimmed)) {
    return "bash";
  }
  if (/^(apiVersion:|kind:|services:|spec:|metadata:|resource\s)/i.test(trimmed)) {
    return "yaml";
  }
  if (/^(def\s|import\s|from\s\w+\simport|class\s\w+:)/i.test(trimmed)) {
    return "python";
  }
  return language || "text";
}

function getLanguageMeta(language: string) {
  const key = language.toLowerCase();
  return (
    LANGUAGE_LABELS[key] ?? {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      prismLanguage: key,
    }
  );
}

export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const detectedLang = autoDetectLanguage(code, language);
  const meta = getLanguageMeta(detectedLang);
  const isDark = resolvedTheme === "dark";

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "not-prose my-4 overflow-hidden rounded-lg border border-border bg-card shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-3.5 py-2 text-muted-foreground">
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wide text-foreground/80">
          <Code2 className="size-3.5 text-primary" />
          {meta.label}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="h-7 w-7 text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3.5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <div className="overflow-x-auto bg-muted/20 dark:bg-[#18181b]">
        <SyntaxHighlighter
          language={meta.prismLanguage}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            className: "font-mono text-xs sm:text-sm",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

