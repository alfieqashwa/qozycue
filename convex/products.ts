import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createProductSchema,
  deleteProductSchema,
  toggleProductSchema,
  updateProductSchema,
} from "../types/schema/product-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  managerProcedure,
  subscriptions,
  validateSubscriptionLimits,
  zMutation,
} from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    //? findAll mostly are protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")

    const user = await ctx.db.get(userId)
    if (!user || !user?.companyId) throw new ConvexError("No user!")

    const products = await ctx.db
      .query("products")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .order("asc")
      .collect()

    return Promise.all(
      products.map(async (product) => {
        const unitOfMeasure = await ctx.db.get(product.unitOfMeasureId)
        const category = await ctx.db.get(product.categoryId)

        return { ...product, unitOfMeasure, category }
      }),
    )
  },
})
export const create = zMutation({
  args: { createProductSchema },
  handler: async (
    ctx,
    {
      createProductSchema: {
        name,
        costPrice,
        salePrice,
        unitOfMeasureId,
        categoryId,
      },
    },
  ) => {
    //? managerProcedure
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "MANAGER"
    ) {
      throw new ConvexError("You do not have access!")
    }
    if (!user) throw new ConvexError("No user!")

    const subs = await subscriptions(ctx, { companyId: user.companyId })
    const isValid = validateSubscriptionLimits({
      subscription: subs.subscription!,
      productLen: subs._count.products,
    })
    if (!isValid) throw new ConvexError("Max product limit exceeded!")

    if (!user.companyId || !unitOfMeasureId || !categoryId)
      throw new ConvexError("Company, uom, category are required!")

    return await ctx.db.insert("products", {
      companyId: user?.companyId,
      name,
      costPrice,
      salePrice,
      unitOfMeasureId,
      categoryId,
      status: "disabled",
      countInStock: 0,
    })
  },
})
export const update = zMutation({
  args: { updateProductSchema },
  handler: async (
    ctx,
    {
      updateProductSchema: {
        id,
        name,
        costPrice,
        salePrice,
        unitOfMeasureId,
        categoryId,
      },
    },
  ) => {
    await managerProcedure(ctx)

    return await ctx.db.patch(id, {
      name,
      costPrice,
      salePrice,
      unitOfMeasureId,
      categoryId,
    })
  },
})

export const updateCountInStock = mutation({
  args: {
    id: v.id("products"),
    updatedStock: v.number(),
  },
  handler: async (ctx, args) => {
    await managerProcedure(ctx)

    return await ctx.db.patch(args.id, {
      countInStock: args.updatedStock,
    })
  },
})

export const toggle = zMutation({
  args: { toggleProductSchema },
  handler: async (ctx, { toggleProductSchema: { id, status } }) => {
    await managerProcedure(ctx)

    return await ctx.db.patch(id, {
      status: status === "enabled" ? "disabled" : "enabled",
    })
  },
})
/**
 * remove && removeSelected is AdminProcedure.
 */
export const remove = zMutation({
  args: { deleteProductSchema },
  handler: async (ctx, { deleteProductSchema: { id } }) => {
    await adminProcedure(ctx)

    return await ctx.db.delete(id)
  },
})
export const removeSelected = mutation({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, { ids }) => {
    await adminProcedure(ctx)

    const removeAll = await Promise.all(
      ids.map(async (id) => await ctx.db.delete(id)),
    )
    return { ...removeAll }
  },
})
