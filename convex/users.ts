import { getAuthUserId } from "@convex-dev/auth/server"
import { zid } from "convex-helpers/server/zod"
import { v } from "convex/values"
import { z } from "zod"
import { mutation, query } from "./_generated/server"
import { superAdminAuth, zMutation } from "./helpers"
import { upsertUserSchema } from "../types/schema/user-schema"

// source -> https://stack.convex.dev/convex-auth
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    return userId !== null ? ctx.db.get(userId) : null
  },
})

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await superAdminAuth(ctx, {})

    const users = await ctx.db.query("users").collect()
    const usersWithCompany = Promise.all(
      users.map(async (user) => {
        if (!user.companyId) throw new Error("There's no company")
        const company = await ctx.db.get(user.companyId)

        return { ...user, companyName: company?.name }
      }),
    )

    return usersWithCompany
  },
})

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()
  },
})

// === MUTATIONS ===

export const updateRoleAndCompanyId = zMutation({
  args: {
    id: zid("users"),
    role: z
      .enum(["DEWA", "ADMIN", "OWNER", "MANAGER", "CASHIER", "USER"])
      .optional(),
    companyId: zid("companies"),
  },
  handler: async (ctx, args) => {
    await superAdminAuth(ctx, {})

    return await ctx.db.patch(args.id, {
      role: args.role,
      companyId: args.companyId,
    })
  },
})

// upsertDewa: dewaProcedure
//   .input(upsertUserSchema)
//   .mutation(async ({ ctx, input }) => {
//     function upsertTeam({ email, role, companyId }: TUpsertUser) {
//       return ctx.db.$transaction(async (tx) => {
//         const user = await tx.user.findUnique({
//           where: { email },
//         })

//         let upsertUser

//         if (!user) {
//           // if no-user, then createTeam
//           upsertUser = await tx.user.create({
//             data: {
//               email,
//               role,
//               companyId,
//             },
//           })
//         } else if (!!user && !user.companyId) {
//           // this is for user who's already on pending page
//           upsertUser = await tx.user.update({
//             where: { email },
//             data: { role, companyId },
//           })
//         } else {
//           return null
//         }
//         return upsertUser
//       })
//     }
//     await upsertTeam(input)
//   }),

export const upsert = zMutation({
  args: { upsertUserSchema },
  handler: async (ctx, { upsertUserSchema: { email, role, companyId } }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique()

    let upsert

    if (!user) {
      // if no-user, then createTeam
      upsert = await ctx.db.insert("users", {
        email,
        role,
        companyId,
      })
    } else if (!!user && !user.companyId) {
      // this is for user who's already on pending page
      upsert = await ctx.db.patch(user._id, {
        role,
        companyId,
      })
    } else {
      return null
    }
    return upsert
  },
})

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await superAdminAuth(ctx, {})
    return await ctx.db.delete(args.id)
  },
})
