import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { GET, POST } from "../../app/api/items/route";

const DATA_FILE = path.join(process.cwd(), "data", "items.json");

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("items API route (App Router)", () => {
  let originalData: string | null;

  before(async () => {
    originalData = await fs.readFile(DATA_FILE, "utf-8").catch(() => null);
  });

  after(async () => {
    if (originalData !== null) {
      await fs.writeFile(DATA_FILE, originalData, "utf-8");
    } else {
      await fs.rm(DATA_FILE, { force: true });
    }
  });

  it("GET returns 200 and a list of items", async () => {
    const res = await GET();
    assert.equal(res.status, 200);
    const body = (await res.json()) as { items: unknown[] };
    assert.ok(Array.isArray(body.items));
  });

  it("POST with a valid body returns 201 and the created item", async () => {
    const res = await POST(jsonRequest({ name: "Chair" }));
    assert.equal(res.status, 201);
    const body = (await res.json()) as { item: { name: string } };
    assert.equal(body.item.name, "Chair");
  });

  it("POST with an empty name returns 400", async () => {
    const res = await POST(jsonRequest({ name: "" }));
    assert.equal(res.status, 400);
  });

  it("POST with a missing name field returns 400", async () => {
    const res = await POST(jsonRequest({}));
    assert.equal(res.status, 400);
  });

  it("POST with malformed JSON returns 400", async () => {
    const res = await POST(jsonRequest("not-json"));
    assert.equal(res.status, 400);
  });
});
