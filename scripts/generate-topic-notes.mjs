import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PATHS_DIR = path.join(process.cwd(), "content/study/learning-paths");
const TOPICS_DIR = path.join(process.cwd(), "content/study/topics");
const SKIP_TOPICS = new Set(["Introduction"]);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildNoteContent(title, pathTitle, moduleName) {
  const isExercise = title.toLowerCase().startsWith("exercise");
  const learnUrl = "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200";

  return `## Overview

${isExercise
    ? `Hands-on exercise covering **${title}** as part of the *${moduleName}* module in the ${pathTitle} learning path.`
    : `Study notes for **${title}** — part of the *${moduleName}* module in the ${pathTitle} learning path for AI-200 exam preparation.`}

## Key concepts

- Core concepts and terminology for this topic
- How it fits into Azure AI solution development
- Common patterns used in production workloads

## Exam tips

- Focus on when and why to use this capability on Azure
- Know the trade-offs and how it connects to other AI-200 skills
- Review official Microsoft Learn docs for the latest service behavior

## Azure CLI

\`\`\`bash
# Replace with resource group and names for your environment
az group create --name rg-ai200 --location eastus

# Add service-specific commands for: ${title}
\`\`\`

## Python

\`\`\`python
# Example pattern for: ${title}
# Integrate with Azure SDKs using managed identity where possible

def main():
    pass  # Implement based on module lab steps

if __name__ == "__main__":
    main()
\`\`\`

## Learn more

- [AI-200 study guide](${learnUrl})
- [Microsoft Learn](https://learn.microsoft.com/)
`;
}

// Remove Introduction from learning paths
for (const file of fs.readdirSync(PATHS_DIR).filter((f) => f.endsWith(".md"))) {
  const filePath = path.join(PATHS_DIR, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  let changed = false;

  parsed.data.modules = parsed.data.modules.map((mod) => {
    const filtered = mod.topics.filter((t) => !SKIP_TOPICS.has(t));
    if (filtered.length !== mod.topics.length) changed = true;
    return { ...mod, topics: filtered };
  });

  if (changed) {
    const out = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, out);
    console.log("Updated:", file);
  }
}

// Generate topic notes
let created = 0;
for (const file of fs.readdirSync(PATHS_DIR).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(PATHS_DIR, file), "utf-8");
  const { data } = matter(raw);
  const pathSlug = data.slug || file.replace(/\.md$/, "");
  const pathTitle = data.title;
  const outDir = path.join(TOPICS_DIR, pathSlug);
  fs.mkdirSync(outDir, { recursive: true });

  for (const mod of data.modules) {
    for (const topic of mod.topics) {
      if (SKIP_TOPICS.has(topic)) continue;
      const topicSlug = slugify(topic);
      const notePath = path.join(outDir, `${topicSlug}.md`);
      if (fs.existsSync(notePath)) continue;

      const frontmatter = {
        title: topic,
        pathSlug,
        moduleName: mod.name,
      };
      const body = buildNoteContent(topic, pathTitle, mod.name);
      fs.writeFileSync(notePath, matter.stringify(body, frontmatter));
      created++;
    }
  }
}

console.log(`Created ${created} topic notes.`);