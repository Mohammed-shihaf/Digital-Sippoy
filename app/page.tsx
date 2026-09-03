import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getItems } from "@/lib/db";
import { ItemsForm } from "./items-form";
import { SignOutButton } from "./sign-out-button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const items = await getItems();

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>DigitalSippoy Items</h1>
        <SignOutButton />
      </div>
      <p style={{ color: "#666", fontSize: 14 }}>
        TypeScript · Node 20.x · npm · Next.js 15.5.24
      </p>
      <ItemsForm />
      <ul style={{ marginTop: 24 }}>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{item.name}</strong>
            <br />
            <small style={{ color: "#999" }}>{new Date(item.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
