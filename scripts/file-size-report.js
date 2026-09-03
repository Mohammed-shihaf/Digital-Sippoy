const { readFileSync, writeFileSync, readdirSync, statSync } = require("node:fs");
const path = require("node:path");

console.log("=== RUNNING FILE SIZE / MAINTAINABILITY SCAN ===");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "out", "coverage", "dist"]);
const SOURCE_EXT = new Set([".js", ".mjs", ".ts", ".tsx"]);
const LARGE_FILE_LINE_THRESHOLD = 300;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, files);
    } else if (SOURCE_EXT.has(path.extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const measurements = [];
for (const file of walk(ROOT)) {
  let content;
  try {
    content = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const lineCount = content.split("\n").length;
  measurements.push({
    file: path.relative(ROOT, file).replace(/\\/g, "/"),
    lines: lineCount,
    flagged: lineCount > LARGE_FILE_LINE_THRESHOLD
  });
}

measurements.sort((a, b) => b.lines - a.lines);
const flagged = measurements.filter((m) => m.flagged);

const report = {
  timestamp: new Date().toISOString(),
  metric: "File Size / Maintainability Scan",
  largeFileLineThreshold: LARGE_FILE_LINE_THRESHOLD,
  totalFilesScanned: measurements.length,
  flaggedFileCount: flagged.length,
  flaggedFiles: flagged,
  top10Largest: measurements.slice(0, 10)
};

const outputPath = path.join(ROOT, "file-size-report.json");
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`File size report generated: ${outputPath} (${flagged.length} files over ${LARGE_FILE_LINE_THRESHOLD} lines)`);
