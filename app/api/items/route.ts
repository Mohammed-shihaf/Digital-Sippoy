import { NextResponse, type NextRequest } from "next/server";
import { requireSession } from "@/lib/require-session";
import { getItems, addItem } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getItems();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { name?: unknown };
    const item = await addItem(body?.name);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid request" },
      { status: 400 }
    );
  }
}
