import { getAuthUserId } from "@convex-dev/auth/server"
import { query } from "./_generated/server"
import { v } from "convex/values"

export const find = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.companyId)
  },
})
