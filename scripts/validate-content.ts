import { validateContent } from "../lib/validate-content";

const { errors, warnings } = validateContent();
const verbose = process.argv.includes("--verbose");

if (warnings.length) {
  console.warn(`${warnings.length} warning(s)${verbose ? ":" : " (run with --verbose to list)"}`);
  if (verbose) warnings.forEach((w) => console.warn(`  warn  ${w}`));
}
if (errors.length) {
  errors.forEach((e) => console.error(`  error ${e}`));
  console.error(`\nContent validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log("Content OK.");
