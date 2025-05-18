import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

const discountSchema = z.object({
  id: zid("discounts"),
  name: z.string().min(1).max(5),
  value: z.coerce.number().lte(100).nonnegative(),
  companyId: zid("companies"),
})

export const createDiscountSchema = discountSchema.omit({
  id: true,
  name: true,
})
export type TCreateDiscount = z.infer<typeof createDiscountSchema>

export const updateDiscountSchema = discountSchema.omit({ name: true })
export type TUpdateDiscount = z.infer<typeof updateDiscountSchema>
