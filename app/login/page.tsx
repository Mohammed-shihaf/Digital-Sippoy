"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4 }}
        />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 4 }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p style={{ color: "#999", fontSize: 12, marginTop: 16 }}>
        Demo: admin / changeme
      </p>
    </main>
  );
}
