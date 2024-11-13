import { v } from "convex/values"
import { query } from "./_generated/server"
import { protectedProcedure } from "./helpers"

export const findAllByOrderId = query({
  args: { orderId: v.optional(v.id("orders")) },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", args.orderId!))
      .collect()

    return Promise.all(
      (orderlines ?? []).map(async (ol) => {
        const product = await ctx.db.get(ol.productId)
        const category =
          product !== null ? await ctx.db.get(product?.categoryId) : null
        const unitOfMeasure =
          product !== null ? await ctx.db.get(product?.unitOfMeasureId) : null

        return { ...ol, product: { ...product, category, unitOfMeasure } }
      }),
    )
  },
})
