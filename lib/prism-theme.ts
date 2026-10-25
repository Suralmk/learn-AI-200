import type { CSSProperties } from "react";

/**
 * Syntax colors as CSS variables (defined in globals.css for light and dark),
 * so server and client render identical markup whatever the theme.
 */
const v = (name: string): CSSProperties => ({ color: `var(--code-${name})` });

export const prismTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': { color: "var(--code-text)", background: "none", fontFamily: "var(--font-plex-mono), ui-monospace, monospace", whiteSpace: "pre", tabSize: 2 },
  'pre[class*="language-"]': { color: "var(--code-text)", background: "none", overflow: "auto" },
  comment: { ...v("comment"), fontStyle: "italic" },
  prolog: v("comment"),
  doctype: v("comment"),
  cdata: v("comment"),
  punctuation: v("punctuation"),
  operator: v("punctuation"),
  keyword: v("keyword"),
  atrule: v("keyword"),
  important: v("keyword"),
  "attr-name": v("type"),
  "class-name": v("type"),
  builtin: v("type"),
  namespace: v("type"),
  function: v("function"),
  property: v("function"),
  tag: v("function"),
  selector: v("function"),
  string: v("string"),
  char: v("string"),
  "attr-value": v("string"),
  regex: v("string"),
  url: v("string"),
  number: v("number"),
  boolean: v("number"),
  constant: v("number"),
  symbol: v("number"),
  variable: v("number"),
  parameter: v("text"),
  key: v("function"),
  deleted: v("number"),
  inserted: v("string"),
  bold: { fontWeight: 600 },
  italic: { fontStyle: "italic" },
};
