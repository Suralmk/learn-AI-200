import type { Metadata } from "next";
import { EXAM } from "./exam-outline";
import { SITE_NAME, SITE_URL } from "./site";

export const MAX_DESCRIPTION = 155;

/** "2026-10-07" → "7 October 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Trim to ≤155 chars on a word boundary, ending with an ellipsis when cut. */
export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const atWord = cut.slice(0, Math.max(cut.lastIndexOf(" "), 0)).replace(/[\s,.;:–—-]+$/, "");
  return `${atWord || cut}…`;
}

export function absoluteUrl(path: string): string {
  // new URL() adds a trailing slash to the bare origin; drop it so "/" matches SITE_URL.
  return new URL(path, SITE_URL).toString().replace(/\/$/, "");
}

/**
 * Per-page metadata: "<Title> · AI-200 Study Guide · AI-200 Learn",
 * a clamped description, canonical on azure.sura.work and OG/Twitter cards.
 * OG images come from each route's opengraph-image file.
 */
export function pageMetadata({
  title,
  description,
  path,
  suffix = `${EXAM.code} Study Guide`,
  type = "article",
}: {
  title: string;
  description: string;
  path: string;
  suffix?: string;
  type?: "article" | "website";
}): Metadata {
  const fullTitle = `${title} · ${suffix} · ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const desc = clampDescription(description);
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: url },
    openGraph: { type, url, title: fullTitle, description: desc, siteName: SITE_NAME, locale: "en_US" },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc },
  };
}
