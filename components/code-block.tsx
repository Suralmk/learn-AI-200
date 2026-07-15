"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
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
    python: { label: "Python", prismLanguage: "python" },
    bash: { label: "Azure CLI", prismLanguage: "bash" },
    sh: { label: "Azure CLI", prismLanguage: "bash" },
    kusto: { label: "KQL", prismLanguage: "sql" },
    csharp: { label: "C#", prismLanguage: "csharp" },
    cs: { label: "C#", prismLanguage: "csharp" },
    json: { label: "JSON", prismLanguage: "json" },
    env: { label: "Env", prismLanguage: "bash" },
    dockerfile: { label: "Dockerfile", prismLanguage: "docker" },
    text: { label: "Diagram", prismLanguage: "text" },
  };

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
  language: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const meta = getLanguageMeta(language);
  const isDark = resolvedTheme === "dark";

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "not-prose my-4 overflow-hidden rounded-md border border-border",
        className
      )}
    >
      <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-muted-foreground">
        <span className="text-xs font-medium tracking-wide">{meta.label}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
      <div className="bg-muted/40 dark:bg-[#1e1e1e]">
        <SyntaxHighlighter
          language={meta.prismLanguage}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
          codeTagProps={{
            className: "font-mono",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
