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
  /** "compact" for short text inside UI such as quiz questions and options. */
  variant?: "doc" | "compact";
  className?: string;
}) {
  const nextId = createIdFactory();

  return (
    <div className={cn("prose", variant === "compact" && "prose-compact", className)}>
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
