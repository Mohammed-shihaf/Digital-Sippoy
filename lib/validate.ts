import { z } from "zod";

const ItemNameSchema = z
  .string({ required_error: "`name` is required" })
  .trim()
  .min(1, "`name` must not be empty")
  .max(200, "`name` must be 200 characters or fewer");

export function assertItemName(name: unknown): string {
  const result = ItemNameSchema.safeParse(name);
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message ?? "Invalid `name`");
  }
  return result.data;
}
