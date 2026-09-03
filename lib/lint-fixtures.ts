/**
 * lint-fixtures.ts — Deliberate lint fixture.
 * Contains intentional violations so ESLint metrics have
 * real, non-blocking findings to report (warn-only mode).
 *
 * Violations present:
 * - Unused variable (no-unused-vars)
 * - High cyclomatic complexity (complexity > 8)
 * - High cognitive complexity (sonarjs/cognitive-complexity > 15)
 * - Over-nesting
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedFixtureVar = "intentionally unused";

// Deliberately exported with wrong casing for fixture purposes
// eslint-disable-next-line @typescript-eslint/naming-convention
export const lint_fixture_export = true;

/**
 * highComplexityExample — intentionally high cyclomatic + cognitive complexity.
 * Trips both `complexity` (>8) and `sonarjs/cognitive-complexity` (>15).
 */
// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export function highComplexityExample(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number
): string {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          if (e > 0) {
            return "all positive";
          } else {
            return "e non-positive";
          }
        } else {
          return "d non-positive";
        }
      } else {
        return "c non-positive";
      }
    } else {
      return "b non-positive";
    }
  } else if (a < 0) {
    if (b < 0) {
      return "a and b negative";
    } else {
      return "a negative b non-negative";
    }
  } else {
    return "a is zero";
  }
}
