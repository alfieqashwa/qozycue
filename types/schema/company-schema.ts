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
    isPublished: z.boolean(),
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
    subscription: z.enum(["TRIAL", "BASIC", "PRO", "ENTERPRISE"]).optional(),
  })
  .required()

export const createTrialCompanySchema = companySchema.pick({
  name: true,
  phone: true,
  location: true,
})
export type TCreateTrialCompany = z.infer<typeof createTrialCompanySchema>

export const createCompanySchema = companySchema.omit({
  id: true,
  logo: true,
  subscription: true,
})
export type TCreateCompany = z.infer<typeof createCompanySchema>

export const updateCompanyDewaSchema = companySchema.omit({
  logo: true,
  isPublished: true,
})
export type TUpdateCompanyDewa = z.infer<typeof updateCompanyDewaSchema>
