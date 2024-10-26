import { v } from "convex/values"
import { query } from "./_generated/server"

export const find = query({
  args: { companyId: v.optional(v.id("companies")) },
  handler: async (ctx, args) => {
    if (!args.companyId) return
    return await ctx.db.get(args.companyId)
  },
})
