import { z } from "zod"

enum Subscription {
  TRIAL,
  BASIC,
  PRO,
  ENTERPRISE,
}

export const companySchema = z
  .object({
    id: z.string().cuid(),
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
    subscription: z.nativeEnum(Subscription),
  })
  .required()

export const createTrialCompanySchema = companySchema.pick({
  name: true,
  phone: true,
  location: true,
})

export type TCreateTrialCompany = z.infer<typeof createTrialCompanySchema>
