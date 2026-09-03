#!/usr/bin/env node
/**
 * code-churn.mjs — Aggregates git log --numstat per tracked file
 * into churn-report.json for risk-based test prioritization.
 */

import { execSync } from "child_process";
import fs from "fs";

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" });
  } catch {
    return "";
  }
}

const log = run("git log --numstat --format=%H --no-merges -n 500");
const lines = log.split("\n");

const churn = {};

for (const line of lines) {
  const match = line.match(/^(\d+)\s+(\d+)\s+(.+)$/);
  if (!match) continue;
  const [, added, deleted, file] = match;
  if (!churn[file]) churn[file] = { commits: 0, added: 0, deleted: 0 };
  churn[file].commits++;
  churn[file].added += Number(added);
  churn[file].deleted += Number(deleted);
}

const sorted = Object.entries(churn)
  .sort(([, a], [, b]) => b.commits - a.commits)
  .map(([file, stats]) => ({ file, ...stats }));

fs.writeFileSync("churn-report.json", JSON.stringify(sorted, null, 2));
console.log(`[code-churn] Written churn-report.json (${sorted.length} files tracked)`);
