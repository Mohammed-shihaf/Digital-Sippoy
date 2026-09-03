import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function requireSession(
  req: NextRequest
): Promise<{ authorized: true } | { authorized: false; status: 401 }> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? "insecure-default-secret-for-fixture",
  });
  if (!token) {
    return { authorized: false, status: 401 };
  }
  return { authorized: true };
}
