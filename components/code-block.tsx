"use client";

import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import bicep from "react-syntax-highlighter/dist/esm/languages/prism/bicep";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import ini from "react-syntax-highlighter/dist/esm/languages/prism/ini";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import powershell from "react-syntax-highlighter/dist/esm/languages/prism/powershell";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import { prismTheme } from "@/lib/prism-theme";

// Register only the languages the notes use; the full Prism bundle is ~10x larger.
for (const [name, lang] of Object.entries({
  bash, bicep, csharp, docker, ini, javascript, json, markdown, markup, powershell, python, sql, typescript, yaml,
})) {
  SyntaxHighlighter.registerLanguage(name, lang);
}
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
    env: { label: "Env", prismLanguage: "ini" },
    ini: { label: "INI", prismLanguage: "ini" },
    toml: { label: "TOML", prismLanguage: "ini" },
    http: { label: "HTTP", prismLanguage: "text" },
    console: { label: "Console", prismLanguage: "bash" },
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
  const detectedLang = autoDetectLanguage(code, language);
  const meta = getLanguageMeta(detectedLang);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      return; // Clipboard blocked (insecure context or permissions): leave the button as is.
    }
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("not-prose group/code my-6 overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <div className="flex items-center justify-between border-b border-border px-3.5 py-1.5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Code2 className="size-3.5" aria-hidden />
          {meta.label}
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={handleCopy}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label={copied ? "Copied" : `Copy ${meta.label} code`}
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={meta.prismLanguage}
          style={prismTheme}
          customStyle={{ margin: 0, padding: "1rem 1.125rem", background: "transparent", fontSize: "0.8125rem", lineHeight: "1.65" }}
          codeTagProps={{ className: "font-mono", style: { fontFamily: "var(--font-plex-mono), ui-monospace, monospace" } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
