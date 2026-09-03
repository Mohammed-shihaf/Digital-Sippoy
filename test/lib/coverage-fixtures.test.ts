import assert from "assert";
import { coveredBranch, uncoveredPath, partialLoop } from "../../lib/coverage-fixtures";

describe("lib/coverage-fixtures", () => {
  describe("coveredBranch", () => {
    it("returns 'positive' for x > 0", () => {
      assert.strictEqual(coveredBranch(5), "positive");
    });

    it("returns 'negative' for x < 0", () => {
      assert.strictEqual(coveredBranch(-3), "negative");
    });

    it("returns 'zero' for x === 0", () => {
      assert.strictEqual(coveredBranch(0), "zero");
    });
  });

  describe("uncoveredPath", () => {
    it("returns 'reachable' when flag is true", () => {
      assert.strictEqual(uncoveredPath(true), "reachable");
    });
    // Note: false branch intentionally not tested — coverage fixture
  });

  describe("partialLoop", () => {
    it("counts items starting with 'a'", () => {
      assert.strictEqual(partialLoop(["apple", "banana", "avocado"]), 2);
    });

    it("returns 0 for empty array", () => {
      assert.strictEqual(partialLoop([]), 0);
    });
  });
});
