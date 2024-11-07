import { v } from "convex/values"
import {
  createDiscountSchema,
  discountSchema,
} from "../types/schema/discount-schema"
import { mutation, query } from "./_generated/server"
import { managerProcedure, protectedProcedure, zMutation } from "./helpers"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.query("discounts").collect()
  },
})
export const create = zMutation({
  args: { createDiscountSchema },
  handler: async (
    ctx,
    { createDiscountSchema: { name, value, companyId } },
  ) => {
    await managerProcedure(ctx, {})

    return await ctx.db.insert("discounts", {
      name,
      value,
      isDefaultValue: false,
      companyId,
    })
  },
})
export const update = zMutation({
  args: { discountSchema },
  handler: async (ctx, { discountSchema: { id, name, value, companyId } }) => {
    await managerProcedure(ctx, {})

    return await ctx.db.patch(id, {
      name,
      value,
      isDefaultValue: false,
      companyId,
    })
  },
})
export const remove = mutation({
  args: { id: v.id("discounts") },
  handler: async (ctx, args) => {
    await managerProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})
