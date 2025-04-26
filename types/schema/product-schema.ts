import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

const productSchema = z.object({
  id: zid("products"),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(3, { message: "Name must be at least 1 characters." })
    .max(30, { message: "Name must contain at most 30 character(s)." }),
  costPrice: z.coerce
    .number({
      required_error: "Cost Price is required.",
      invalid_type_error: "Cost Price must be a number.",
    })
    .nonnegative({
      message: "Cost Price must be zero or a positive number.",
    }),
  salePrice: z.coerce
    .number({
      required_error: "Sale Price is required.",
      invalid_type_error: "Sale Price must be a number.",
    })
    .nonnegative({
      message: "Sale Price must be zero or a positive number.",
    }),
  status: z.enum(["enabled", "disabled"]),
  countInStock: z.coerce
    .number({
      required_error: "Stock is required.",
      invalid_type_error: "Stock must be a number.",
    })
    .nonnegative({
      message: "Stock must be zero or a positive number.",
    }),
  unitOfMeasureId: zid("unitOfMeasures").optional(),
  categoryId: zid("categories").optional(),

  /**
   * TODO: setup later!
   * stockQuantity: z
   *   .number({ invalid_type_error: "Stock qty must be a number." })
   *   .nonnegative({ message: "Stock qty must be zero or a positive number." })
   *   .optional(),
   */
})

export const createProductSchema = productSchema
  .omit({
    id: true,
    status: true,
    countInStock: true,
  })
  .refine((val) => val.costPrice <= val.salePrice, {
    path: ["comparison price"],
    message: "Cost Price must be less than Sale Price",
  })

export const updateProductSchema = productSchema
  .omit({
    status: true,
    countInStock: true,
    unitOfMeasureId: true,
  })
  .refine((val) => val.costPrice <= val.salePrice, {
    path: ["comparison price"],
    message: "Cost Price must be less than Sale Price",
  })

export type TUpdateProduct = z.infer<typeof updateProductSchema>
/*
  Unanswered how to display zod-refine error-message. 
  https://github.com/shadcn-ui/ui/discussions/2120
*/

export type TCreateProduct = z.infer<typeof createProductSchema>

export const toggleProductSchema = productSchema.pick({
  id: true,
  status: true,
})
export type TToggleProduct = z.infer<typeof toggleProductSchema>

export const deleteProductSchema = productSchema.pick({ id: true })

// export const deleteSelectedProductSchema = z.object({
//   ids: z.array(productSchema.pick({ id: true })),
// })
