import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const taxSchema = z.object({
  id: zid("taxes"),
  name: z.string().min(1).max(4),
  value: z.coerce.number(),
  companyId: zid("companies"),
})
export type TTax = z.infer<typeof taxSchema>

export const createTaxSchema = taxSchema.omit({ id: true })
export type TCreateTax = z.infer<typeof createTaxSchema>
