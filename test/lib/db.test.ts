import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { getItems, addItem } from "../../lib/db";

const DATA_FILE = path.join(process.cwd(), "data", "items.json");

async function restoreDataFile(original: string | null): Promise<void> {
  if (original !== null) {
    await fs.writeFile(DATA_FILE, original, "utf-8");
  } else {
    await fs.rm(DATA_FILE, { force: true });
  }
}

describe("lib/db.ts", () => {
  let originalData: string | null;

  before(async () => {
    originalData = await fs.readFile(DATA_FILE, "utf-8").catch(() => null);
  });

  afterEach(async () => {
    await restoreDataFile(originalData);
  });

  it("reads existing items as an array", async () => {
    const items = await getItems();
    assert.ok(Array.isArray(items));
  });

  it("adds a new item and persists it", async () => {
    const item = await addItem("Test Item");
    assert.ok(item.id);
    assert.equal(item.name, "Test Item");

    const items = await getItems();
    assert.ok(items.some((i) => i.id === item.id));
  });

  it("rejects an empty name", async () => {
    await assert.rejects(() => addItem(""));
  });

  it("rejects a whitespace-only name", async () => {
    await assert.rejects(() => addItem("   "));
  });

  it("sorts items newest-first", async () => {
    await addItem("First");
    await addItem("Second");
    const items = await getItems();
    for (let i = 1; i < items.length; i++) {
      assert.ok(items[i - 1].createdAt >= items[i].createdAt);
    }
  });

  it("returns an empty array when the data file is missing (ENOENT)", async () => {
    await fs.rm(DATA_FILE, { force: true });
    const items = await getItems();
    assert.deepEqual(items, []);
  });
});
