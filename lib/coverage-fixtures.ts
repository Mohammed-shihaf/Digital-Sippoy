/**
 * coverage-fixtures.ts — Deliberate coverage fixture.
 * Contains intentionally partially-covered code so nyc/vitest
 * coverage metrics have a real, non-trivial surface to measure.
 */

export function coveredBranch(x: number): string {
  if (x > 0) {
    return "positive";
  } else if (x < 0) {
    return "negative";
  } else {
    return "zero";
  }
}

// Intentionally uncovered path — exists to lower branch % deliberately
export function uncoveredPath(flag: boolean): string {
  if (flag) {
    return "reachable";
  }
  // This path is intentionally never exercised in tests
  return "unreachable-fixture";
}

export function partialLoop(items: string[]): number {
  let count = 0;
  for (const item of items) {
    if (item.startsWith("a")) {
      count++;
    }
  }
  return count;
}
