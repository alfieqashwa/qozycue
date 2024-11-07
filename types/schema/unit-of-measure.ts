import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const uomSchema = z.object({
  id: zid("unitOfMeasures"),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(1, { message: "Name must be at least 1 characters." })
    .max(10, { message: "Name must contain at most 10 character(s)." }),
  description: z.string().max(15),
})
export type TUom = z.infer<typeof uomSchema>

export const createUomSchema = uomSchema.omit({ id: true })
export type TCreateUom = z.infer<typeof createUomSchema>
