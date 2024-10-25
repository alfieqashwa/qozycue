import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  users: defineTable({
    companyId: v.optional(v.id("companies")),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("DEWA"),
        v.literal("ADMIN"),
        v.literal("OWNER"),
        v.literal("MANAGER"),
        v.literal("CASHIER"),
        v.literal("USER"),
      ),
    ),
  }).index("email", ["email"]),
  // TODO: Companies Schema
});
