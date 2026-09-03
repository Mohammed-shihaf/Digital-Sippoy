#!/usr/bin/env node
/**
 * lint-density.mjs — Reads lint-report.json and computes
 * violation density (violations per 100 lines of TS source).
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const REPORT = "lint-report.json";

if (!fs.existsSync(REPORT)) {
  console.log("[lint-density] No lint-report.json found. Run npm run lint:report first.");
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(REPORT, "utf-8"));

let totalErrors = 0;
let totalWarnings = 0;
let totalFiles = 0;

for (const file of report) {
  if (file.errorCount > 0 || file.warningCount > 0) totalFiles++;
  totalErrors += file.errorCount;
  totalWarnings += file.warningCount;
}

// Count total lines of TS source
let totalLines = 0;
try {
  const result = execSync(
    'git ls-files "*.ts" "*.tsx" | xargs wc -l 2>/dev/null || echo "0"',
    { encoding: "utf-8" }
  );
  const match = result.match(/(\d+)\s+total/);
  if (match) totalLines = parseInt(match[1], 10);
} catch {
  totalLines = 0;
}

const density = totalLines > 0 ? ((totalErrors + totalWarnings) / totalLines * 100).toFixed(2) : "N/A";

const output = {
  tool: "eslint",
  timestamp: new Date().toISOString(),
  totalErrors,
  totalWarnings,
  totalViolations: totalErrors + totalWarnings,
  filesWithViolations: totalFiles,
  totalSourceLines: totalLines,
  violationDensityPer100Lines: density,
};

fs.writeFileSync("violation-density-report.json", JSON.stringify(output, null, 2));
console.log("[lint-density] Written violation-density-report.json");
console.table(output);
