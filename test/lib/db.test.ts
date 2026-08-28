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

  it("trims surrounding whitespace off the stored name", async () => {
    const item = await addItem("  Chair  ");
    assert.equal(item.name, "Chair");
  });

  it("rejects an empty name with the expected message", async () => {
    await assert.rejects(() => addItem(""), /non-empty string/);
  });

  it("rejects a whitespace-only name with the expected message", async () => {
    await assert.rejects(() => addItem("   "), /non-empty string/);
  });

  it("sorts items newest-first by createdAt, not insertion order", async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify([
        { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
        { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
      ]),
      "utf-8"
    );
    const items = await getItems();
    assert.deepEqual(
      items.map((i) => i.id),
      ["b", "a"]
    );
  });

  it("leaves an already-sorted file unchanged (comparator isn't a blind reversal)", async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify([
        { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
        { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
      ]),
      "utf-8"
    );
    const items = await getItems();
    assert.deepEqual(
      items.map((i) => i.id),
      ["b", "a"]
    );
  });

  it("returns an empty array when the data file is missing (ENOENT)", async () => {
    await fs.rm(DATA_FILE, { force: true });
    const items = await getItems();
    assert.deepEqual(items, []);
  });

  it("re-throws non-ENOENT read errors instead of swallowing them", async () => {
    // Replace the data file with a directory of the same name: reading it
    // fails with EISDIR, not ENOENT, so getItems() must propagate the error
    // rather than treating it like a missing file.
    await fs.rm(DATA_FILE, { force: true, recursive: true });
    await fs.mkdir(DATA_FILE, { recursive: true });
    try {
      await assert.rejects(() => getItems());
    } finally {
      await fs.rm(DATA_FILE, { force: true, recursive: true });
    }
  });
});
