const { readFileSync, writeFileSync, readdirSync, statSync, existsSync } = require("node:fs");
const path = require("node:path");

console.log("=== RUNNING ENVIRONMENT VARIABLE AUDIT ===");

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "out", "coverage", "dist"]);
const SOURCE_EXT = new Set([".js", ".mjs", ".ts", ".tsx"]);
const ENV_VAR_PATTERN = /process\.env\.([A-Z0-9_]+)/g;

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

const usedVars = new Map();
for (const file of walk(ROOT)) {
  let content;
  try {
    content = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  for (const match of content.matchAll(ENV_VAR_PATTERN)) {
    const name = match[1];
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    if (!usedVars.has(name)) usedVars.set(name, new Set());
    usedVars.get(name).add(rel);
  }
}

const documentedVars = new Set();
for (const candidate of [".env.example", ".env.sample", "items-service/.env.example"]) {
  const p = path.join(ROOT, candidate);
  if (existsSync(p)) {
    const content = readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
      if (m) documentedVars.add(m[1]);
    }
  }
}

const undocumented = [];
for (const [name, files] of usedVars) {
  if (!documentedVars.has(name)) {
    undocumented.push({ name, referencedIn: [...files] });
  }
}

const report = {
  timestamp: new Date().toISOString(),
  metric: "Environment Variable Audit",
  totalEnvVarsUsed: usedVars.size,
  documentedVarsFound: documentedVars.size,
  undocumentedCount: undocumented.length,
  undocumentedVars: undocumented,
  verdict: undocumented.length === 0 ? "PASS — all env vars documented." : "REVIEW — undocumented env vars found."
};

const outputPath = path.join(ROOT, "env-var-audit-report.json");
writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`Environment variable audit report generated: ${outputPath}`);
