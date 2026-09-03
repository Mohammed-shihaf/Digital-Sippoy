#!/usr/bin/env node
/**
 * coverage-delta.mjs — Compares current nyc coverage summary against
 * a committed baseline and reports the delta. Informational only.
 */

import fs from "fs";
import path from "path";

const SUMMARY = path.join("nyc-mocha", "coverage-summary.json");
const BASELINE = "coverage-baseline.json";

function load(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

const current = load(SUMMARY);
const baseline = load(BASELINE);

if (!current) {
  console.log("[coverage-delta] No coverage summary found. Run npm run test:coverage first.");
  process.exit(0);
}

const totals = current.total;
const metrics = ["statements", "branches", "functions", "lines"];

console.log("\n=== Coverage Delta Report ===");
console.log(`Comparing: ${SUMMARY} vs ${BASELINE ?? "(no baseline)"}\n`);

if (!baseline) {
  console.log("No baseline found. Current coverage:\n");
  for (const m of metrics) {
    const pct = totals[m]?.pct ?? 0;
    console.log(`  ${m.padEnd(12)}: ${pct.toFixed(2)}%`);
  }
  console.log("\nTip: commit coverage-baseline.json to track deltas over time.");
} else {
  const baselineTotals = baseline.total ?? baseline;
  for (const m of metrics) {
    const curr = totals[m]?.pct ?? 0;
    const base = baselineTotals[m]?.pct ?? baselineTotals[m] ?? 0;
    const delta = curr - base;
    const sign = delta >= 0 ? "+" : "";
    const flag = delta < -2 ? " ⚠️  REGRESSION" : "";
    console.log(`  ${m.padEnd(12)}: ${curr.toFixed(2)}%  (${sign}${delta.toFixed(2)}%${flag})`);
  }
}

console.log("\n[coverage-delta] Done.");
