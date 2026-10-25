import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownContent } from "@/components/markdown-content";

const md = "Run this:\n\n```bash\naz acr build .\n```\n\n| a | b |\n|---|---|\n| 1 | 2 |\n";

describe("MarkdownContent inside interactive controls", () => {
  it("renders code and tables without buttons or focus stops in the inline variant", () => {
    const html = renderToStaticMarkup(<MarkdownContent content={md} variant="inline" />);
    expect(html).toContain("az acr build");
    expect(html).toContain("<table");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("tabindex");
  });

  it("keeps the copy button in study notes", () => {
    const html = renderToStaticMarkup(<MarkdownContent content={md} />);
    expect(html).toContain("<button");
  });
});
