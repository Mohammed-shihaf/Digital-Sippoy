import assert from "node:assert/strict";
import { assertItemName } from "../../lib/validate";

describe("lib/validate.ts", () => {
  it("returns the trimmed name for valid input", () => {
    assert.equal(assertItemName("  Lamp  "), "Lamp");
  });

  it("rejects a non-string name", () => {
    assert.throws(() => assertItemName(42), /non-empty string/);
  });

  it("rejects null", () => {
    assert.throws(() => assertItemName(null), /non-empty string/);
  });

  it("rejects an empty string", () => {
    assert.throws(() => assertItemName(""), /non-empty string/);
  });
});
