import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  esbuild: { jsx: "automatic" },
  test: { include: ["tests/**/*.test.{ts,tsx}"], environment: "node" },
});
