"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{ padding: "6px 14px", cursor: "pointer", border: "1px solid #ccc", borderRadius: 4 }}
    >
      Sign out
    </button>
  );
}
