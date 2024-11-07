import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const discountSchema = z.object({
  id: zid("discounts"),
  name: z.string().min(1).max(4),
  value: z.coerce.number(),
  companyId: zid("companies"),
})
export type TDiscount = z.infer<typeof discountSchema>

export const createDiscountSchema = discountSchema.omit({ id: true })
export type TCreateDiscount = z.infer<typeof createDiscountSchema>
