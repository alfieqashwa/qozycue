import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const customerSchema = z.object({
  id: zid("customers"),
  name: z.string().min(3).max(25),
  phone: z.string().max(12).optional(),
  email: z.string().email().optional(),
  gender: z.enum(["female", "male"]),
  orderId: zid("orders"),
})

export const updateCustomerByOrderIdSchema = customerSchema.omit({
  id: true,
  email: true,
  gender: true,
})
export type TUpdateCustomerByOrderId = z.infer<
  typeof updateCustomerByOrderIdSchema
>

/**
 *  customers: defineTable({
 *   name: v.string(),
 *   phone: v.optional(v.string()),
 *   email: v.optional(v.string()),
 *   gender: v.optional(v.union(v.literal("FEMALE"), v.literal("MALE"))),
 *   companyId: v.id("companies"),
 * })
 *   .index("companyId", ["companyId"])
 *   .index("by_name", ["name"]),
 */
