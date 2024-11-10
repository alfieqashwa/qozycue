import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

const poolTableSchema = z.object({
  id: zid("poolTables"),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(1, { message: "Name must be at least 1 characters." })
    .max(3, { message: "Name must contain at most 3 character(s)." }),
  description: z.string().max(30),
  status: z.enum(["enabled", "disabled"]),
  companyId: zid("companies"),
})

export const createPoolTableSchema = poolTableSchema.omit({
  id: true,
  description: true,
  status: true,
})
export type TCreatePoolTable = z.infer<typeof createPoolTableSchema>

export const updatePoolTableSchema = poolTableSchema.omit({
  description: true,
  status: true,
})
export type TUpdatePoolTable = z.infer<typeof updatePoolTableSchema>

export const togglePoolSchema = poolTableSchema.pick({ id: true, status: true })
export type TTogglePool = z.infer<typeof togglePoolSchema>

export const updateGapDurationSchema = z.object({
  poolTableId: z.string().cuid(),
  gapDuration: z.coerce
    .number({
      required_error: "Gap Duration is required.",
      invalid_type_error: "Gap Duration must be a number.",
    })
    .nonnegative({ message: "Gap Duration must be 0 or a positive number." })
    .gte(5)
    .lte(15),
})
export type TUpdateGapDuration = z.infer<typeof updateGapDurationSchema>

export const findGapDurationSchema = updateGapDurationSchema.omit({
  gapDuration: true,
})
export type TFindGapDuration = z.infer<typeof findGapDurationSchema>
