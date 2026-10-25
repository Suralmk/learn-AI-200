import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { Callout, type CalloutKind } from "@/components/doc/callout";
import { ComparisonTable } from "@/components/doc/comparison-table";
import { Mermaid } from "@/components/doc/mermaid";
import { remarkAlerts } from "@/lib/remark-alerts";
import { createIdFactory } from "@/lib/toc";
import { cn } from "@/lib/utils";

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getNodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export function MarkdownContent({
  content,
  variant = "doc",
  className,
}: {
  content: string;
  /**
   * "compact": short text inside UI such as quiz questions and explanations.
   * "inline": compact, and free of interactive elements (no copy buttons, focusable
   * table frames or links), for use inside buttons such as answer options.
   */
  variant?: "doc" | "compact" | "inline";
  className?: string;
}) {
  const nextId = createIdFactory();
  const inline = variant === "inline";

  return (
    <div className={cn("prose", variant !== "doc" && "prose-compact", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkAlerts]}
        components={{
          h2({ children }) {
            return (
              <h2 id={nextId(getNodeText(children))} className="scroll-mt-24">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 id={nextId(getNodeText(children))} className="scroll-mt-24">
                {children}
              </h3>
            );
          },
          blockquote({ children, ...props }) {
            const kind = (props as { "data-callout"?: CalloutKind })["data-callout"];
            if (kind) return <Callout kind={kind}>{children}</Callout>;
            return <blockquote>{children}</blockquote>;
          },
          table({ children }) {
            if (inline) {
              return (
                <div className="not-prose my-2 overflow-x-auto">
                  <table className="w-full text-sm">{children}</table>
                </div>
              );
            }
            return <ComparisonTable>{children}</ComparisonTable>;
          },
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...props }) {
            const match = /language-([\w-]+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");
            if (match?.[1] === "mermaid") return <Mermaid code={code} />;
            if (match || code.includes("\n")) {
              if (inline) {
                return (
                  <pre className="not-prose my-2 overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-[0.8125rem]">
                    <code>{code}</code>
                  </pre>
                );
              }
              return <CodeBlock code={code} language={match?.[1]} />;
            }
            return (
              <code
                className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href = "", children }) {
            if (inline) return <span className="underline">{children}</span>;
            if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
            if (href.startsWith("#")) return <a href={href}>{children}</a>;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
