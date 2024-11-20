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

export const createCustomerSchema = customerSchema.pick({
  name: true,
  phone: true,
})
export type TCreateCustomer = z.infer<typeof createCustomerSchema>

export const updateCustomerByOrderIdSchema = customerSchema.omit({
  id: true,
  email: true,
  gender: true,
})
export type TUpdateCustomerByOrderId = z.infer<
  typeof updateCustomerByOrderIdSchema
>
