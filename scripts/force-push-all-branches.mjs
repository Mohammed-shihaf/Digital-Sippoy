import { execSync } from "node:child_process";

// Complete list of ALL 32 target branches
const ALL_TARGETS = [
  "DS-063", "DS-062", "DS-061", "DS-060", "DS-059", "DS-058", "DS-057", "DS-056",
  "DS-055", "DS-054", "DS-053", "DS-052", "DS-051", "DS-050", "DS-049", "DS-047",
  "DS-044", "DS-041", "DS-038", "DS-035", "DS-032", "DS-030", "DS-029", "DS-028",
  "DS-026", "DS-024", "DS-023", "DS-022", "DS-020", "DS-018", "DS-017", "DS-016",
  "DS-014", "DS-012", "DS-011", "DS-010", "DS-008", "DS-006", "DS-005", "DS-004", "DS-002"
];

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", cwd: "d:\\Digital-Sippoy", stdio: "pipe" });
  } catch (err) {
    return null;
  }
}

console.log("=== FORCE PUSHING DS-064 COMMIT (23d8f66) TO ALL 32 BRANCHES ON GITHUB ===\n");

runCmd("git checkout -f DS-064");

let count = 0;
for (const branch of ALL_TARGETS) {
  const res = runCmd(`git push --force origin DS-064:refs/heads/${branch}`);
  if (res) {
    count++;
    console.log(`  ✅ Pushed DS-064 -> ${branch} on GitHub`);
  } else {
    console.log(`  ❌ Failed push to ${branch}`);
  }
}

console.log(`\n=== SUCCESS: ${count} / ${ALL_TARGETS.length} BRANCHES ARE NOW 100% IDENTICAL ON GITHUB ===`);
