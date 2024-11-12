import { v } from "convex/values"
import { query } from "./_generated/server"
import { protectedProcedure } from "./helpers"

// export const findById = query({
//   args: { orderId: v.optional(v.id("orders")) },
//   handler: async (ctx, args) => {
//     await protectedProcedure(ctx, {})

//     const poolRental = await ctx.db
//       .query("poolRentals")
//       .withIndex("orderId", (q) => q.eq("orderId", args.orderId!))
//       .unique()

//     return poolRental !== null ? await ctx.db.get(poolRental?.packetId) : null
//   },
// })
