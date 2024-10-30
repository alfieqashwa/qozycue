import { v } from "convex/values"
import { query } from "./_generated/server"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()
  },
})

// export const findAllByCompanyId = query({
//   args: { companyId: v.id("companies") },
//   handler: async (ctx, args) => {
//     const poolTables = ctx.db
//       .query("poolTables")
//       .filter((q) => q.eq(q.field("companyId"), args.companyId))
//       .collect()
//     const company = await ctx.db.get(args.companyId)

//     const poolTableList = (await poolTables).map((table) => ({
//       ...table,
//       company: {
//         isPublished: company?.isPublished,
//       },
//     }))

//     if (!poolTableList) return []
//     return poolTableList
//   },
// })
