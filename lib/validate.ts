/**
 * Shared by app/api/items/route.ts and lib/db.ts so the "name must be a
 * non-empty string" rule is defined once instead of copy-pasted in both
 * places (see jscpd.json / the Redundancy Localization finding this
 * replaces).
 */
export function assertItemName(name: unknown): string {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("`name` is required and must be a non-empty string");
  }
  return name.trim();
}
