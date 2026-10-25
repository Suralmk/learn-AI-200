import { describe, expect, it } from "vitest";
import { TEMPLATE_SECTIONS, checkMarkdown, validateContent } from "@/lib/validate-content";

const routes = new Set(["/study/a", "/study/a/b"]);

describe("checkMarkdown", () => {
  it("flags an H1 in the body but not inside code fences", () => {
    const body = "```bash\n# comment\n```\n\n# Title\n";
    const { errors } = checkMarkdown("x.md", body, routes);
    expect(errors).toEqual(["x.md:5: H1 in body (the page renders the title as H1)"]);
  });

  it("handles CRLF line endings", () => {
    const crlf = ["```bash", "# comment", "```", ""].join(String.fromCharCode(13, 10));
    const { errors } = checkMarkdown("x.md", crlf, routes);
    expect(errors).toEqual([]);
  });

  it("flags code fences without a language", () => {
    const { errors } = checkMarkdown("x.md", "text\n```\ncode\n```\n", routes);
    expect(errors).toEqual(["x.md:2: code fence without a language"]);
  });

  it("flags internal links that do not resolve", () => {
    const body = "[ok](/study/a/b#x) [bad](/study/a/zzz) [ext](https://learn.microsoft.com)";
    const { errors } = checkMarkdown("x.md", body, routes);
    expect(errors).toEqual(["x.md:1: broken internal link /study/a/zzz"]);
  });

  it("warns when a topic is missing template sections", () => {
    const body = TEMPLATE_SECTIONS.slice(1).map((s) => `## ${s}\n\ntext`).join("\n\n");
    const { warnings } = checkMarkdown("x.md", body, routes, { template: true });
    expect(warnings.join()).toContain(`missing section "${TEMPLATE_SECTIONS[0]}"`);
  });
});

describe("validateContent", () => {
  it("passes on the repository content", () => {
    const { errors } = validateContent();
    expect(errors).toEqual([]);
  });
});
