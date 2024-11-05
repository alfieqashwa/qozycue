import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { updateUserSchema, upsertUserSchema } from "../types/schema/user-schema"
import { mutation, query } from "./_generated/server"
import { superAdminProcedure, zMutation } from "./helpers"

// source -> https://stack.convex.dev/convex-auth
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    return userId !== null ? ctx.db.get(userId) : null
  },
})

export const findUserWithCompany = query({
  args: {
    userId: v.optional(v.id("users")),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    if (!args.userId || !args.companyId)
      throw new Error("No User ID nor Company ID was provided!")

    const user = await ctx.db.get(args.userId)
    const company = await ctx.db.get(args.companyId)

    return { user, company }
  },
})

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await superAdminProcedure(ctx, {})

    const users = await ctx.db.query("users").collect()
    const usersWithCompany = Promise.all(
      users.map(async (user) => {
        const company =
          user.companyId != null ? await ctx.db.get(user.companyId) : null

        return { ...user, companyName: company?.name ?? "" }
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
  args: { updateUserSchema },
  handler: async (ctx, { updateUserSchema: { id, role, companyId } }) => {
    await superAdminProcedure(ctx, {})

    return await ctx.db.patch(id, {
      role,
      companyId,
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
    await superAdminProcedure(ctx, {})
    return await ctx.db.delete(args.id)
  },
})
