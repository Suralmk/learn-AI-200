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

const LANGUAGE_META: Record<
  string,
  { label: string; headerClass: string; prismLanguage: string }
> = {
  python: {
    label: "Python",
    headerClass: "bg-[#3776ab]",
    prismLanguage: "python",
  },
  bash: {
    label: "Azure CLI",
    headerClass: "bg-[#0177d1]",
    prismLanguage: "bash",
  },
  sh: {
    label: "Azure CLI",
    headerClass: "bg-[#0177d1]",
    prismLanguage: "bash",
  },
  kusto: {
    label: "KQL",
    headerClass: "bg-[#55198b]",
    prismLanguage: "sql",
  },
  csharp: {
    label: "C#",
    headerClass: "bg-[#68217a]",
    prismLanguage: "csharp",
  },
  cs: {
    label: "C#",
    headerClass: "bg-[#68217a]",
    prismLanguage: "csharp",
  },
  json: {
    label: "JSON",
    headerClass: "bg-[#292929]",
    prismLanguage: "json",
  },
};

const DEFAULT_META = {
  label: "Code",
  headerClass: "bg-muted-foreground/80",
  prismLanguage: "text",
};

function getLanguageMeta(language: string) {
  const key = language.toLowerCase();
  return LANGUAGE_META[key] ?? {
    ...DEFAULT_META,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    prismLanguage: key,
  };
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
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 text-white",
          meta.headerClass
        )}
      >
        <span className="text-xs font-medium tracking-wide">{meta.label}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="text-white hover:bg-white/15 hover:text-white"
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
