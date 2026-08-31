import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { getItems, addItem } from "../../lib/db";
import { DATA_FILE, captureDataFile, restoreDataFile } from "../helpers/data-file";

const AUDIT_FILE = path.join(process.cwd(), "data", "audit.log");

async function seedDataFile(
  items: { id: string; name: string; createdAt: string }[]
): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items), "utf-8");
}

async function assertItemsOrder(expectedIds: string[]): Promise<void> {
  const items = await getItems();
  assert.deepEqual(
    items.map((i) => i.id),
    expectedIds
  );
}

describe("lib/db.ts", () => {
  let originalData: string | null;

  before(async () => {
    originalData = await captureDataFile();
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
    await seedDataFile([
      { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
      { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
    ]);
    await assertItemsOrder(["b", "a"]);
  });

  it("leaves an already-sorted file unchanged (comparator isn't a blind reversal)", async () => {
    await seedDataFile([
      { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
      { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
    ]);
    await assertItemsOrder(["b", "a"]);
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

describe("lib/db.ts — audit log (Audit Trail Verification)", () => {
  let originalData: string | null;
  let originalAudit: string | null;

  before(async () => {
    originalData = await captureDataFile();
    originalAudit = await fs.readFile(AUDIT_FILE, "utf-8").catch(() => null);
  });

  afterEach(async () => {
    await restoreDataFile(originalData);
    // Restore audit log: delete it if it didn't exist before, otherwise restore
    if (originalAudit === null) {
      await fs.rm(AUDIT_FILE, { force: true });
    } else {
      await fs.writeFile(AUDIT_FILE, originalAudit, "utf-8");
    }
  });

  it("addItem() appends a structured JSON line to data/audit.log", async () => {
    const item = await addItem("Audited Item");

    const logContent = await fs.readFile(AUDIT_FILE, "utf-8");
    const lines = logContent.trim().split("\n").filter(Boolean);
    assert.ok(lines.length >= 1, "audit.log must contain at least one entry");

    // Parse the last entry — it must be valid JSON
    const lastEntry = JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
    assert.equal(lastEntry.action, "item.created", "action field must be 'item.created'");
    assert.equal(lastEntry.id, item.id, "audit entry must record the item id");
    assert.equal(
      lastEntry.nameLength,
      item.name.length,
      "audit entry records nameLength, not the name value (PII-safe)"
    );
    assert.ok(
      typeof lastEntry.ts === "string" && lastEntry.ts.length > 0,
      "audit entry must have a timestamp"
    );
  });

  it("audit log entries are valid ISO 8601 timestamps", async () => {
    await addItem("Timestamp Item");
    const logContent = await fs.readFile(AUDIT_FILE, "utf-8");
    const lines = logContent.trim().split("\n").filter(Boolean);
    const entry = JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
    const ts = new Date(entry.ts as string);
    assert.ok(!isNaN(ts.getTime()), "ts must be a valid ISO 8601 date string");
  });

  it("multiple addItem() calls each produce one audit log entry", async () => {
    await addItem("First");
    await addItem("Second");
    const logContent = await fs.readFile(AUDIT_FILE, "utf-8");
    const lines = logContent.trim().split("\n").filter(Boolean);
    assert.ok(lines.length >= 2, "two addItem calls must produce at least 2 audit entries");
    // Both lines must parse as valid JSON
    for (const line of lines) {
      assert.doesNotThrow(() => JSON.parse(line), `Line must be valid JSON: ${line}`);
    }
  });
});
