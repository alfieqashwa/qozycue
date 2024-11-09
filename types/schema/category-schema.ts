import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const categorySchema = z.object({
  id: zid("categories"),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(3, { message: "Name must be at least 1 characters." })
    .max(15, { message: "Name must contain at most 15 character(s)." }),
  description: z.string().max(30),
})
export type TCategory = z.infer<typeof categorySchema>

export const createCategorySchema = categorySchema.omit({ id: true })
export type TCreateCategory = z.infer<typeof createCategorySchema>
