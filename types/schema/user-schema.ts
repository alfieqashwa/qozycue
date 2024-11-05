import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const userSchema = z.object({
  id: zid("users"),
  name: z.string().optional(),
  email: z.string().email(),
  role: z
    .enum(["DEWA", "ADMIN", "OWNER", "MANAGER", "CASHIER", "USER"])
    .optional(),
  companyId: zid("companies").optional(),
})

export type TUser = z.infer<typeof userSchema>

export const updateUserSchema = userSchema.omit({ name: true, email: true })
export type TUpdateUser = z.infer<typeof updateUserSchema>

export const upsertTeamSchema = userSchema.omit({
  id: true,
  name: true,
  companyId: true,
})
export type TUpsertTeam = z.infer<typeof upsertTeamSchema>

export const upsertUserSchema = userSchema.omit({ id: true, name: true })
export type TUpsertUser = z.infer<typeof upsertUserSchema>
