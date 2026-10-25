import { describe, expect, it } from "vitest";
import pkg from "@/package.json";
import { GITHUB_REPO_URL, SITE_NAME, SITE_URL, githubEditUrl } from "@/lib/site";
import { DOMAINS } from "@/lib/domains";

describe("site constants", () => {
  it("uses the canonical origin and name", () => {
    expect(SITE_URL).toBe("https://azure.sura.work");
    expect(SITE_NAME).toBe("AI-200 Learn");
  });

  it("derives the GitHub URL from package.json", () => {
    expect(GITHUB_REPO_URL).toBe(pkg.repository.url.replace(/\.git$/, ""));
    expect(githubEditUrl("content/study/guides/x.md")).toBe(
      `${GITHUB_REPO_URL}/edit/main/content/study/guides/x.md`
    );
  });

  it("takes domain weights from the exam outline", () => {
    expect(DOMAINS.find((d) => d.id === "data-management")?.weight).toBe("30–35%");
  });
});
