import { getAuthUserId } from "@convex-dev/auth/server"
import { zid } from "convex-helpers/server/zod"
import { v } from "convex/values"
import { z } from "zod"
import { mutation, query } from "./_generated/server"
import { superAdminAuth, zMutation } from "./helpers"

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

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await superAdminAuth(ctx, {})
    return await ctx.db.delete(args.id)
  },
})
