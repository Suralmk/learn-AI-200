import type { HTMLAttributes, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    return getNodeText(
      (node as { props: { children?: ReactNode } }).props.children
    );
  }
  return "";
}

function createIdFactory() {
  const seen = new Map<string, number>();
  return (text: string) => {
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    return id;
  };
}

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const nextId = createIdFactory();

  return (
    <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children, ...props }) {
            const id = nextId(getNodeText(children));
            return (
              <h2 id={id} className="scroll-mt-24" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const id = nextId(getNodeText(children));
            return (
              <h3 id={id} className="scroll-mt-24" {...props}>
                {children}
              </h3>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock code={code} language={match[1]} />;
            }

            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children, ...props }) {
            const isHash = href?.startsWith("#");
            return (
              <a
                href={href}
                {...(isHash
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="text-primary underline-offset-4 hover:underline"
                {...props}
              >
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
