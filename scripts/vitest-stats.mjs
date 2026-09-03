#!/usr/bin/env node
/**
 * vitest-stats.mjs — Reads vitest-coverage/coverage-summary.json
 * and emits vitest-stats.json sidecar with key metrics.
 */

import fs from "fs";

const SUMMARY = "vitest-coverage/coverage-summary.json";

if (!fs.existsSync(SUMMARY)) {
  console.log("[vitest-stats] No vitest coverage summary found.");
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(SUMMARY, "utf-8"));
const totals = data.total;

const stats = {
  tool: "vitest + @vitest/coverage-v8",
  node: process.version,
  timestamp: new Date().toISOString(),
  statements: totals.statements?.pct ?? 0,
  branches: totals.branches?.pct ?? 0,
  functions: totals.functions?.pct ?? 0,
  lines: totals.lines?.pct ?? 0,
};

fs.writeFileSync("vitest-stats.json", JSON.stringify(stats, null, 2));
console.log("[vitest-stats] Written vitest-stats.json");
console.table(stats);
