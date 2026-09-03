import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      reportsDirectory: "./vitest-coverage",
      include: ["lib/**/*.ts", "app/**/*.ts", "app/**/*.tsx"],
      exclude: ["node_modules", ".next", "test"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
