import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const orderlineSchema = z.object({
  id: zid("orderlines"),
  orderlineStatus: z.enum(["ORDERED", "UNORDERED"]).optional(),
  description: z.string().max(30),
  amount: z.coerce
    .number({
      required_error: "Amount is required.",
      invalid_type_error: "Amount must be a number.",
    })
    .nonnegative({ message: "Amount must be 0 or a positive number." }),
  quantity: z.coerce
    .number({
      required_error: "Qty is required.",
      invalid_type_error: "Qty must be a number.",
    })
    .nonnegative({ message: "Qty must be 0 or a positive number." }),
  productId: zid("products"),
  countInStock: z.coerce
    .number({
      required_error: "Stock is required.",
      invalid_type_error: "Stock must be a number.",
    })
    .nonnegative({
      message: "Stock must be zero or a positive number.",
    }),
  orderId: zid("orders"),
})
export type TOrderline = z.infer<typeof orderlineSchema>

export const createOrderlineSchema = orderlineSchema.omit({
  id: true,
  description: true,
  orderId: true,
})
export type TCreateOrderLine = z.infer<typeof createOrderlineSchema>

export const upsertOrderlineSchema = orderlineSchema
  .omit({
    id: true,
    description: true,
  })
  .extend({ id: zid("orderlines").optional() })
export type TUpsertOrderLine = z.infer<typeof upsertOrderlineSchema>
