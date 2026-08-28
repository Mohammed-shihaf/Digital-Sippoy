import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { GET, POST } from "../../app/api/items/route";
import { ITEM_NAME_MAX_LENGTH } from "../../lib/validate";
import { authenticatedRequest, anonymousRequest } from "../helpers/session";

const DATA_FILE = path.join(process.cwd(), "data", "items.json");
const ITEMS_URL = "http://localhost/api/items";

async function authedPost(body: unknown) {
  const request = await authenticatedRequest(ITEMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(request);
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

  it("GET without a session returns 401", async () => {
    const res = await GET(anonymousRequest(ITEMS_URL));
    assert.equal(res.status, 401);
  });

  it("POST without a session returns 401 and never touches the store", async () => {
    const before = await fs.readFile(DATA_FILE, "utf-8").catch(() => "[]");
    const res = await POST(
      anonymousRequest(ITEMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Should not be created" }),
      })
    );
    assert.equal(res.status, 401);
    const after = await fs.readFile(DATA_FILE, "utf-8").catch(() => "[]");
    assert.equal(after, before);
  });

  it("GET with a valid session returns 200 and a list of items", async () => {
    const res = await GET(await authenticatedRequest(ITEMS_URL));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { items: unknown[] };
    assert.ok(Array.isArray(body.items));
  });

  it("POST with a valid session and body returns 201 and the created item", async () => {
    const res = await authedPost({ name: "Chair" });
    assert.equal(res.status, 201);
    const body = (await res.json()) as { item: { name: string } };
    assert.equal(body.item.name, "Chair");
  });

  it("POST with an empty name returns 400 with the validation message", async () => {
    const res = await authedPost({ name: "" });
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.match(body.error, /non-empty string/);
  });

  it("POST with a missing name field returns 400 with the validation message", async () => {
    const res = await authedPost({});
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.match(body.error, /non-empty string/);
  });

  it("POST with a null body returns 400 via the validation message, not a crash", async () => {
    // Exercises the `(body as {...})?.name` optional chain. Without it,
    // reading `.name` off a null body throws a TypeError that the same
    // catch block also turns into a 400 -- so the status code alone can't
    // tell them apart; the message can, since only the real validation
    // path produces "non-empty string".
    const res = await authedPost(null);
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.match(body.error, /non-empty string/);
  });

  it("POST with an over-long name returns 400 (a cap the old manual check lacked)", async () => {
    const res = await authedPost({ name: "x".repeat(ITEM_NAME_MAX_LENGTH + 1) });
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.match(body.error, /200 characters or fewer/);
  });

  it("POST with malformed JSON returns 400 with the parse-error message", async () => {
    const res = await authedPost("not-json");
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: string };
    assert.equal(body.error, "Invalid JSON body");
  });
});
