const { readFileSync, writeFileSync, readdirSync, statSync } = require("node:fs");
const path = require("node:path");

console.log("=== SCANNING FOR TODO / FIXME / HACK MARKERS ===");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "out", "coverage", "dist"]);
const SOURCE_EXT = new Set([".js", ".mjs", ".ts", ".tsx"]);
const MARKER_PATTERN = /\b(TODO|FIXME|HACK)\b[:\s]*(.*)/;

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

const findings = [];
for (const file of walk(ROOT)) {
  let lines;
  try {
    lines = readFileSync(file, "utf-8").split("\n");
  } catch {
    continue;
  }
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  lines.forEach((line, idx) => {
    const m = line.match(MARKER_PATTERN);
    if (m) {
      findings.push({
        file: rel,
        line: idx + 1,
        marker: m[1],
        text: m[2].trim().slice(0, 200)
      });
    }
  });
}

const byMarker = findings.reduce((acc, f) => {
  acc[f.marker] = (acc[f.marker] || 0) + 1;
  return acc;
}, {});

const report = {
  timestamp: new Date().toISOString(),
  metric: "TODO / FIXME / HACK Marker Report",
  totalMarkersFound: findings.length,
  countsByMarker: byMarker,
  findings
};

const outputPath = path.join(ROOT, "todo-fixme-report.json");
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`TODO/FIXME/HACK report generated: ${outputPath} (${findings.length} markers found)`);
