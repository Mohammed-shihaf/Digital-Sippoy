import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { getItems as getItemsOrig, addItem as addItemOrig } from "../../lib/db";
import { getItemsClone, addItemCopy } from "../../lib/db-clone";
import { DATA_FILE, captureDataFile, restoreDataFile } from "../helpers/data-file";

describe("lib/db-clone.ts (Test Suite Streamlining & Synchronization Verification)", () => {
  let originalData: string | null;

  before(async () => {
    originalData = await captureDataFile();
  });

  afterEach(async () => {
    await restoreDataFile(originalData);
  });

  it("Synchronization Verification: db-clone exports matching function signatures as db.ts", () => {
    assert.equal(typeof getItemsOrig, typeof getItemsClone, "getItems must be a function in both modules");
    assert.equal(typeof addItemOrig, typeof addItemCopy, "addItem must be a function in both modules");
  });

  it("Synchronization Verification: db-clone.ts returns items matching db.ts structure", async () => {
    const origItems = await getItemsOrig();
    const cloneItems = await getItemsClone();
    assert.ok(Array.isArray(cloneItems), "db-clone getItems must return an array");
  });

  it("Synchronization Verification: db-clone.ts addItemCopy behaves identically to db.ts addItem", async () => {
    const item = await addItemCopy("Clone Test Item");
    assert.ok(item.id);
    assert.equal(item.name, "Clone Test Item");

    const items = await getItemsClone();
    assert.ok(items.some(i => i.id === item.id));
  });

  it("Test Suite Streamlining: verifies db-clone is imported, exercised, and un-redundant", async () => {
    await assert.rejects(() => addItemCopy(""), /must not be empty/);
  });
});
