"use client";

import { useState, useRef } from "react";

export function ItemsForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = inputRef.current?.value.trim() ?? "";
    if (!name) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to add item");
      }

      if (inputRef.current) inputRef.current.value = "";
      setStatus("idle");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="New item name…"
        maxLength={200}
        required
        style={{ flex: 1, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4 }}
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 4 }}
      >
        {status === "loading" ? "Adding…" : "Add"}
      </button>
      {error && <span style={{ color: "red", alignSelf: "center" }}>{error}</span>}
    </form>
  );
}
