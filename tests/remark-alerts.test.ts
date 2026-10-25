import { describe, expect, it } from "vitest";
import { remarkAlerts } from "@/lib/remark-alerts";

type Node = { type: string; value?: string; children?: Node[]; data?: { hProperties?: Record<string, string> } };

const tree = (first: string): Node => ({
  type: "root",
  children: [
    {
      type: "blockquote",
      children: [{ type: "paragraph", children: [{ type: "text", value: first }] }],
    },
  ],
});

describe("remarkAlerts", () => {
  it("marks GFM alerts and strips the marker", () => {
    const t = tree("[!WARNING]\n**Exam trap:** min replicas 0 means cold starts.");
    remarkAlerts()(t);
    const bq = t.children![0];
    expect(bq.data?.hProperties?.["data-callout"]).toBe("warning");
    expect(bq.children![0].children![0].value).toBe("**Exam trap:** min replicas 0 means cold starts.");
  });

  it("drops an empty first paragraph left by a marker on its own line", () => {
    const t = tree("[!TIP]");
    remarkAlerts()(t);
    expect(t.children![0].data?.hProperties?.["data-callout"]).toBe("tip");
    expect(t.children![0].children).toHaveLength(0);
  });

  it("leaves ordinary blockquotes alone", () => {
    const t = tree("Just a quote");
    remarkAlerts()(t);
    expect(t.children![0].data).toBeUndefined();
  });
});
