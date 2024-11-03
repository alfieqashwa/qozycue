import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const userSchema = z.object({
  id: zid("users"),
  email: z.string().email(),
  role: z
    .enum(["DEWA", "ADMIN", "OWNER", "MANAGER", "CASHIER", "USER"])
    .optional(),
  companyId: zid("companies"),
})

export const upsertTeamSchema = userSchema.omit({ id: true, companyId: true })
export type TUpsertTeam = z.infer<typeof upsertTeamSchema>

export const upsertUserSchema = userSchema.omit({ id: true })
export type TUpsertUser = z.infer<typeof upsertUserSchema>
