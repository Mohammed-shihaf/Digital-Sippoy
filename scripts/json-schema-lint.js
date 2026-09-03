const { readFileSync, writeFileSync, readdirSync, statSync } = require("node:fs");
const path = require("node:path");

console.log("=== LINTING TRACKED JSON FILES FOR PARSE ERRORS ===");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "out", "coverage", "dist"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, files);
    } else if (path.extname(entry) === ".json") {
      files.push(full);
    }
  }
  return files;
}

const results = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  try {
    const content = readFileSync(file, "utf-8");
    JSON.parse(content);
    results.push({ file: rel, valid: true });
  } catch (err) {
    results.push({ file: rel, valid: false, error: err.message });
  }
}

const invalid = results.filter((r) => !r.valid);

const report = {
  timestamp: new Date().toISOString(),
  metric: "JSON Schema / Parse Lint",
  totalJsonFilesScanned: results.length,
  invalidCount: invalid.length,
  invalidFiles: invalid,
  verdict: invalid.length === 0 ? "PASS — all JSON files parse cleanly." : "FAIL — malformed JSON found."
};

const outputPath = path.join(ROOT, "json-schema-lint-report.json");
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`JSON lint report generated: ${outputPath} (${invalid.length} invalid files)`);
