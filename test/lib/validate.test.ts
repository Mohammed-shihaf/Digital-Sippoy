import assert from "assert";
import { assertItemName } from "../../lib/validate";

describe("lib/validate — assertItemName", () => {
  it("returns trimmed name for valid input", () => {
    assert.strictEqual(assertItemName("  Hello  "), "Hello");
  });

  it("throws for empty string", () => {
    assert.throws(() => assertItemName(""), /must not be empty/);
  });

  it("throws for whitespace-only string", () => {
    assert.throws(() => assertItemName("   "), /must not be empty/);
  });

  it("throws for non-string input", () => {
    assert.throws(() => assertItemName(123), /required/);
  });

  it("throws for null", () => {
    assert.throws(() => assertItemName(null), /required/);
  });

  it("throws for name exceeding 200 chars", () => {
    assert.throws(() => assertItemName("a".repeat(201)), /200 characters/);
  });

  it("accepts exactly 200 chars", () => {
    const name = "a".repeat(200);
    assert.strictEqual(assertItemName(name), name);
  });
});
