import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { createTaxSchema, updateTaxSchema } from "../types/schema/tax-schema"
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
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = await ctx.db.get(userId)

    const taxes = await ctx.db
      .query("taxes")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .collect()

    const sortedByValue = taxes.sort((p, q) => p.value - q.value)
    return sortedByValue
  },
})
export const create = zMutation({
  args: { createTaxSchema },
  handler: async (ctx, { createTaxSchema: { value, companyId } }) => {
    await managerProcedure(ctx)

    const val = percentToDecimal(value)
    const name = decimalToPercent(val)
    return await ctx.db.insert("taxes", {
      name: `${name}%`,
      value: val,
      isDefaultValue: false,
      companyId,
    })
  },
})

export const update = zMutation({
  args: { updateTaxSchema },
  handler: async (ctx, { updateTaxSchema: { id, value, companyId } }) => {
    await managerProcedure(ctx)

    const val = percentToDecimal(value)
    const name = decimalToPercent(val)
    return await ctx.db.patch(id, {
      name: `${name}%`,
      value: val,
      companyId,
    })
  },
})

export const findDefaultValue = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = await ctx.db.get(userId)

    return await ctx.db
      .query("taxes")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) => q.eq(q.field("isDefaultValue"), true))
      .first()
  },
})

export const toggle = mutation({
  args: { id: v.id("taxes"), isDefaultValue: v.boolean() },
  handler: async (ctx, args) => {
    await managerProcedure(ctx)
    return await ctx.db.patch(args.id, { isDefaultValue: !args.isDefaultValue })
  },
})

export const remove = mutation({
  args: { id: v.id("taxes") },
  handler: async (ctx, args) => {
    await managerProcedure(ctx)
    return await ctx.db.delete(args.id)
  },
})
