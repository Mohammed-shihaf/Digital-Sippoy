import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

/**
 * Pages Router equivalent of the App Router branches' require-session.ts.
 * next-auth/jwt's getToken() accepts a NextApiRequest directly (it's
 * IncomingMessage-based, same as what getToken expects there), so the
 * pattern -- and the reason for it (keeping this directly callable from
 * tests without Next's implicit request context) -- carries over
 * unchanged. Writes the 401 response itself and returns false, matching
 * Pages Router's imperative req/res style rather than App Router's
 * return-a-Response style.
 */
export async function requireSession(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const token = await getToken({ req, secret: authOptions.secret });
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }
  return true;
}

/**
 * Role-based access control guard — checks if the current session token
 * has administrative privileges ('admin' role). Currently unexercised by
 * API tests, providing realistic non-100% coverage data for this module.
 */
export async function requireAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const token = await getToken({ req, secret: authOptions.secret });
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }
  if ((token as { role?: string }).role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin role required" });
    return false;
  }
  return true;
}
