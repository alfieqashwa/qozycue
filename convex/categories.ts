import { ConvexError, v } from "convex/values"
import {
  categorySchema,
  createCategorySchema,
} from "../types/schema/category-schema"
import { mutation, query } from "./_generated/server"
import { protectedProcedure, superAdminProcedure, zMutation } from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await protectedProcedure(ctx)

    return await ctx.db.query("categories").collect()
  },
})

export const findByProductId = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId)

    return product ? ctx.db.get(product.categoryId) : null
  },
})

export const create = zMutation({
  args: { createCategorySchema },
  handler: async (ctx, { createCategorySchema: { name, description } }) => {
    await superAdminProcedure(ctx)

    return await ctx.db.insert("categories", { name, description })
  },
})
export const update = zMutation({
  args: { categorySchema },
  handler: async (ctx, { categorySchema: { id, name, description } }) => {
    await superAdminProcedure(ctx)

    return await ctx.db.patch(id, { name, description })
  },
})
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx)

    return await ctx.db.delete(args.id)
  },
})
