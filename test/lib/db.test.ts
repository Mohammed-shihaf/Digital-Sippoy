import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { getItems, addItem } from "../../lib/db";
import {
  useFakeItemsService,
  withBrokenServer,
  type FakeItem,
} from "../helpers/fake-items-service";

const SEED: FakeItem[] = [
  { id: "1", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
  { id: "2", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
];

describe("lib/db.ts (items-service HTTP client)", () => {
  const service = useFakeItemsService(SEED);

  it("getItems() returns items-service's items, newest-first", async () => {
    const items = await getItems();
    assert.deepEqual(
      items.map((i) => i.id),
      ["2", "1"]
    );
  });

  it("addItem() posts the name and returns the created item", async () => {
    const item = await addItem("Chair");
    assert.equal(item.name, "Chair");
    assert.ok(item.id);

    const items = await getItems();
    assert.ok(items.some((i) => i.id === item.id));
  });

  it("addItem() throws with items-service's validation error message", async () => {
    await assert.rejects(() => addItem(""), /non-empty string/);
  });

  it("addItem() sends the body as application/json", async () => {
    let receivedContentType: string | undefined;
    const server = http.createServer((req, res) => {
      receivedContentType = req.headers["content-type"];
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ item: { id: "x", name: "Chair", createdAt: "now" } }));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    process.env.ITEMS_SERVICE_URL = `http://127.0.0.1:${port}`;
    try {
      await addItem("Chair");
      assert.equal(receivedContentType, "application/json");
    } finally {
      process.env.ITEMS_SERVICE_URL = service.url;
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("getItems() throws when items-service is unreachable", async () => {
    process.env.ITEMS_SERVICE_URL = "http://127.0.0.1:47999";
    try {
      await assert.rejects(() => getItems());
    } finally {
      process.env.ITEMS_SERVICE_URL = service.url;
    }
  });

  it("addItem() throws when items-service's response body isn't valid JSON", async () => {
    await withBrokenServer(
      (res) => res.writeHead(201, { "Content-Type": "application/json" }).end("not-json"),
      service.url,
      async () => {
        await assert.rejects(() => addItem("Chair"), /returned 201/);
      }
    );
  });

  it("getItems() throws when items-service responds with an error status", async () => {
    await withBrokenServer(
      (res) => res.writeHead(500).end(),
      service.url,
      async () => {
        await assert.rejects(() => getItems(), /returned 500/);
      }
    );
  });
});
