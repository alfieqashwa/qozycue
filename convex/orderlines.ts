import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { upsertOrderlineSchema } from "../types/schema/orderline-schema"
import { mutation, query } from "./_generated/server"
import { cashierProcedure, protectedProcedure, zMutation } from "./helpers"

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

// === MUTATIONS ===

export const updateOrderlineStatusList = mutation({
  args: {
    ids: v.array(v.id("orderlines")),
  },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const updateAll = Promise.all(
      args.ids.map(
        async (id) =>
          await ctx.db.patch(id, {
            orderlineStatus: "ORDERED",
          }),
      ),
    )
    return { ...updateAll }
  },
})

export const upsert = zMutation({
  args: { upsertOrderlineSchema },
  handler: async (
    ctx,
    {
      upsertOrderlineSchema: {
        id,
        orderId,
        orderlineStatus,
        productId,
        quantity,
        amount,
      },
    },
  ) => {
    // cashierProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    if (!!id && orderlineStatus === "UNORDERED") {
      // update new orderline
      return await ctx.db.patch(id, {
        quantity,
        amount,
      })
    } else {
      // otherwise, create
      return await ctx.db.insert("orderlines", {
        productId,
        quantity,
        amount,
        orderId,
        orderlineStatus: "ORDERED",
      })
    }
  },
})

export const remove = mutation({
  args: { id: v.id("orderlines") },
  handler: async (ctx, args) => {
    await cashierProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})
