import { v } from "convex/values"
import { query } from "./_generated/server"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const poolTables = ctx.db
      .query("poolTables")
      .filter((q) => q.eq(q.field("companyId"), args.companyId))
      .collect()
    const company = await ctx.db.get(args.companyId)

    return {
      ...poolTables,
      company,
    }
  },
})
