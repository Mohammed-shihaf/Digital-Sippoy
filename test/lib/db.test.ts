import assert from "assert";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Temporarily override DATA_FILE by setting cwd
// We test getItems and addItem through a temp directory

describe("lib/db", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ds-test-"));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("getItems returns empty array when no file exists", async () => {
    const { getItems } = await import("../../lib/db");
    const items = await getItems();
    assert.deepStrictEqual(items, []);
  });

  it("addItem creates item and persists to file", async () => {
    const { addItem } = await import("../../lib/db");
    const item = await addItem("Test item");
    assert.strictEqual(item.name, "Test item");
    assert.ok(item.id);
    assert.ok(item.createdAt);

    const raw = await fs.readFile(path.join(tmpDir, "data", "items.json"), "utf-8");
    const saved = JSON.parse(raw) as unknown[];
    assert.strictEqual(saved.length, 1);
  });

  it("addItem throws for invalid name", async () => {
    const { addItem } = await import("../../lib/db");
    await assert.rejects(() => addItem(""), /must not be empty/);
  });

  it("getItems returns items sorted newest first", async () => {
    const { addItem, getItems } = await import("../../lib/db");
    await addItem("First");
    await addItem("Second");
    const items = await getItems();
    assert.strictEqual(items[0]?.name, "Second");
  });
});
