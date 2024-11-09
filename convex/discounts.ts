import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createDiscountSchema,
  updateDiscountSchema,
} from "../types/schema/discount-schema"
import { mutation, query } from "./_generated/server"
import {
  decimalToPercent,
  managerProcedure,
  percentToDecimal,
  zMutation,
} from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) throw new ConvexError("Please signed in!")
    const user = await ctx.db.get(userId)

    const discounts = await ctx.db
      .query("discounts")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .collect()
    const sortedByValue = discounts.sort((p, q) => p.value - q.value)

    return sortedByValue
  },
})
export const create = zMutation({
  args: { createDiscountSchema },
  handler: async (ctx, { createDiscountSchema: { value, companyId } }) => {
    await managerProcedure(ctx, {})

    const val = percentToDecimal(value)
    const name = decimalToPercent(val)
    return await ctx.db.insert("discounts", {
      name: `${name}%`,
      value: val,
      isDefaultValue: false,
      companyId,
    })
  },
})
export const update = zMutation({
  args: { updateDiscountSchema },
  handler: async (ctx, { updateDiscountSchema: { id, value, companyId } }) => {
    await managerProcedure(ctx, {})

    const val = percentToDecimal(value)
    const name = decimalToPercent(val)
    return await ctx.db.patch(id, {
      name: `${name}%`,
      value: val,
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
