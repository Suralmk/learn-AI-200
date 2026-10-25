import { describe, expect, it } from "vitest";
import { createIdFactory, pageToc } from "@/lib/toc";

describe("pageToc", () => {
  it("uses rendered text for ids so inline markdown matches MarkdownContent", () => {
    const toc = pageToc("## Use `az acr build` with **ACR**\n\n## [Links](https://x) here\n");
    expect(toc.map((t) => t.id)).toEqual(["use-az-acr-build-with-acr", "links-here"]);
    expect(toc[0].title).toBe("Use az acr build with ACR");
  });

  it("numbers duplicate headings the same way as the shared id factory", () => {
    const next = createIdFactory();
    expect([next("Setup"), next("Setup")]).toEqual(["setup", "setup-2"]);
    expect(pageToc("## Setup\n\n### Setup\n\n## Setup\n").map((t) => t.id)).toEqual(["setup", "setup-3"]);
  });

  it("drops a hand-written table of contents section", () => {
    expect(pageToc("## Table of contents\n- a\n\n## Real\n").map((t) => t.title)).toEqual(["Real"]);
  });
});
