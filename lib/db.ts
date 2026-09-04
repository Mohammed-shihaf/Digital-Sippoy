import fs from "node:fs/promises";
import path from "node:path";
import { assertItemName } from "./validate";

export type Item = {
  id: string;
  name: string;
  createdAt: string;
};

function getDataFile(): string {
  return path.join(process.cwd(), "data", "items.json");
}

async function readAll(): Promise<Item[]> {
  const dataFile = getDataFile();
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw) as Item[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeAll(items: Item[]): Promise<void> {
  const dataFile = getDataFile();
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

export async function getItems(): Promise<Item[]> {
  const items = await readAll();
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addItem(name: unknown): Promise<Item> {
  const trimmed = assertItemName(name);
  const items = await readAll();
  const item: Item = {
    id: crypto.randomUUID(),
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  await writeAll(items);
  return item;
}
