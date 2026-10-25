"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

/** Renders a Mermaid diagram client-side; the library loads only when a diagram is on the page. */
export function Mermaid({ code }: { code: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        const dark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "var(--font-plex-sans), sans-serif",
          themeVariables: {
            primaryColor: dark ? "#11294a" : "#e8f2fc",
            primaryTextColor: dark ? "#e6edf7" : "#0e1726",
            primaryBorderColor: dark ? "#3b9cff" : "#0177d1",
            lineColor: dark ? "#94a3b8" : "#5b6b82",
            secondaryColor: dark ? "#2a1914" : "#fff3ee",
            tertiaryColor: dark ? "#0f1a2b" : "#f6f8fb",
            background: "transparent",
            fontSize: "14px",
          },
        });
        const { svg } = await mermaid.render(`mmd-${id}-${dark ? "d" : "l"}`, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme]);

  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <figure className="my-8 overflow-x-auto rounded-lg border border-border bg-surface p-4">
      <div ref={ref} className="flex min-h-24 justify-center [&_svg]:h-auto [&_svg]:max-w-full" aria-label="Diagram" role="img" />
      <figcaption className="sr-only">Diagram source: {code}</figcaption>
    </figure>
  );
}
