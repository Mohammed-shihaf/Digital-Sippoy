const { readFileSync, writeFileSync, readdirSync, statSync } = require("node:fs");
const path = require("node:path");

console.log("=== CHECKING FOR POTENTIALLY UNUSED EXPORTS ===");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "out", "coverage", "dist"]);
const SOURCE_EXT = new Set([".js", ".mjs", ".ts", ".tsx"]);
const EXPORT_PATTERN = /export\s+(?:const|function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;

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

const allFiles = walk(ROOT);
const fileContents = new Map();
for (const file of allFiles) {
  try {
    fileContents.set(file, readFileSync(file, "utf-8"));
  } catch {
    // unreadable file, skip
  }
}

const exportsByFile = [];
for (const [file, content] of fileContents) {
  const names = [...content.matchAll(EXPORT_PATTERN)].map((m) => m[1]);
  if (names.length) exportsByFile.push({ file, names });
}

const potentiallyUnused = [];
for (const { file, names } of exportsByFile) {
  for (const name of names) {
    let referenceCount = 0;
    for (const [otherFile, content] of fileContents) {
      if (otherFile === file) continue;
      const usagePattern = new RegExp(`\\b${name}\\b`);
      if (usagePattern.test(content)) referenceCount++;
    }
    if (referenceCount === 0) {
      potentiallyUnused.push({ file: path.relative(ROOT, file).replace(/\\/g, "/"), exportName: name });
    }
  }
}

const report = {
  timestamp: new Date().toISOString(),
  metric: "Potentially Unused Exports Check",
  note: "Heuristic text-based scan (no type resolution). Verify manually before removing.",
  totalExportsScanned: exportsByFile.reduce((sum, e) => sum + e.names.length, 0),
  potentiallyUnusedCount: potentiallyUnused.length,
  potentiallyUnused
};

const outputPath = path.join(ROOT, "unused-exports-report.json");
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`Unused exports report generated: ${outputPath} (${potentiallyUnused.length} candidates found)`);
