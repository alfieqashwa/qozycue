import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

// enum Subscription {
//   TRIAL,
//   BASIC,
//   PRO,
//   ENTERPRISE,
// }

// export type Subscription = "TRIAL" | "BASIC" | "PRO" | "ENTERPRISE" | undefined

export const companySchema = z
  .object({
    id: zid("companies"),
    customLossMinute: z.boolean().optional(),
    isPublished: z.boolean(),
    isStockable: z.boolean(),
    name: z
      .string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a string.",
      })
      .min(3)
      .max(25),
    phone: z.string().min(11).max(13),
    logo: z.string().url().optional().nullable(),
    location: z
      .string({
        required_error: "Required.",
        invalid_type_error: "Must be a string.",
      })
      .min(10),
    countryCode: z.string({
      required_error: "Country Code is required.",
      invalid_type_error: "Country Code must be a string.",
    }),
    subscription: z.enum(["TRIAL", "BASIC", "PRO", "ENTERPRISE"]).optional(),
  })
  .required()

export const createTrialCompanySchema = companySchema.pick({
  name: true,
  phone: true,
  location: true,
  countryCode: true,
})
export type TCreateTrialCompany = z.infer<typeof createTrialCompanySchema>

export const createCompanySchema = companySchema.omit({
  id: true,
  logo: true,
  subscription: true,
  isStockable: true,
})
export type TCreateCompany = z.infer<typeof createCompanySchema>

export const updateCompanyZenithSchema = companySchema.omit({
  logo: true,
  isPublished: true,
  isStockable: true,
})
export type TUpdateCompanyZenith = z.infer<typeof updateCompanyZenithSchema>

export const updateCompanyByAdminSchema = companySchema.pick({
  id: true,
  phone: true,
  location: true,
  countryCode: true,
})
export type TUpdateCompanyByAdmin = z.infer<typeof updateCompanyByAdminSchema>

export const toggleIsPublishedSchema = companySchema.pick({
  id: true,
  isPublished: true,
})
export type TToggleIsPublished = z.infer<typeof toggleIsPublishedSchema>

export const toggleIsStockableSchema = companySchema.pick({
  id: true,
  isStockable: true,
})
export type TToggleIsStockable = z.infer<typeof toggleIsStockableSchema>

export const toggleCustomLossMinuteSchema = companySchema.pick({
  id: true,
  customLossMinute: true,
})
export type TToggleCustomLossMinute = z.infer<
  typeof toggleCustomLossMinuteSchema
>
