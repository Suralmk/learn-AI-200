/**
 * Turns GitHub-style alerts (`> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`,
 * `> [!IMPORTANT]`, `> [!CAUTION]`) into blockquotes tagged with
 * `data-callout`, which MarkdownContent renders as a Callout.
 */

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, string> };
};

const MARKER = /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*\r?\n?/i;

function visit(node: MdNode) {
  if (node.type === "blockquote") tagAlert(node);
  node.children?.forEach(visit);
}

function tagAlert(blockquote: MdNode) {
  const paragraph = blockquote.children?.[0];
  const text = paragraph?.type === "paragraph" ? paragraph.children?.[0] : undefined;
  if (!paragraph || text?.type !== "text" || !text.value) return;

  const match = MARKER.exec(text.value);
  if (!match) return;

  text.value = text.value.slice(match[0].length);
  if (text.value === "") paragraph.children!.shift();
  // A soft line break right after the marker would otherwise render as a blank line.
  if (paragraph.children![0]?.type === "break") paragraph.children!.shift();
  if (paragraph.children!.length === 0) blockquote.children!.shift();

  blockquote.data = { hProperties: { "data-callout": match[1].toLowerCase() } };
}

export function remarkAlerts() {
  return (tree: MdNode) => visit(tree);
}
