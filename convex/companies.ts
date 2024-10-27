import { v } from "convex/values"
import { query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"

export const find = query({
  args: { companyId: v.optional(v.id("companies")) },
  handler: async (ctx, args) => {
    if (!args.companyId) return
    return await ctx.db.get(args.companyId)
  },
})

export const company = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const user = await ctx.db.get(userId)
    if (!user || !user.companyId) return null

    const company = await ctx.db.get(user.companyId)
    return company
  },
})
