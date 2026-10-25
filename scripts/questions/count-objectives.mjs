// Prints originals / generated / total per objective.
// Run: node scripts/questions/count-objectives.mjs
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content/questions");
const map = JSON.parse(fs.readFileSync(path.join(dir, "objective-map.json"), "utf8"));
const outline = fs.readFileSync(path.join(process.cwd(), "lib/exam-outline.ts"), "utf8");
const objectives = [...outline.matchAll(/\["([a-z0-9-]+)", "/g)].map((m) => m[1]);

const counts = Object.fromEntries(objectives.map((o) => [o, { orig: 0, gen: 0 }]));
let originals = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "objective-map.json")) {
  for (const q of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))) {
    if (q.source === "generated") counts[q.objective].gen++;
    else {
      originals++;
      if (map[q.id]) counts[map[q.id]].orig++;
    }
  }
}
console.log(`originals ${originals}, mapped ${Object.keys(map).length}, unmapped ${originals - Object.keys(map).length}`);
for (const o of objectives) {
  const c = counts[o];
  console.log(`${o.padEnd(28)} ${String(c.orig).padStart(3)} ${String(c.gen).padStart(3)} ${String(c.orig + c.gen).padStart(3)}${c.orig + c.gen < 10 ? "  <10" : ""}`);
}
