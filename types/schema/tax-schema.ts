import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

const taxSchema = z.object({
  id: zid("taxes"),
  name: z.string().min(1).max(5),
  value: z.coerce.number(),
  companyId: zid("companies"),
})

export const createTaxSchema = taxSchema.omit({ id: true, value: true })
export type TCreateTax = z.infer<typeof createTaxSchema>

export const updateTaxSchema = taxSchema.omit({ value: true })
export type TUpdateTax = z.infer<typeof updateTaxSchema>
