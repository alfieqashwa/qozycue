import { v } from "convex/values"
import { createTaxSchema, updateTaxSchema } from "../types/schema/tax-schema"
import { mutation, query } from "./_generated/server"
import {
  managerProcedure,
  percentToDecimal,
  protectedProcedure,
  zMutation,
} from "./helpers"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.query("taxes").collect()
  },
})
export const create = zMutation({
  args: { createTaxSchema },
  handler: async (ctx, { createTaxSchema: { value, companyId } }) => {
    await managerProcedure(ctx, {})

    const val = percentToDecimal(value)
    return await ctx.db.insert("taxes", {
      name: `${val}%`,
      value: val,
      isDefaultValue: false,
      companyId,
    })
  },
})
export const update = zMutation({
  args: { updateTaxSchema },
  handler: async (ctx, { updateTaxSchema: { id, value, companyId } }) => {
    await managerProcedure(ctx, {})

    const val = percentToDecimal(value)
    return await ctx.db.patch(id, {
      name: `${val}%`,
      value: val,
      isDefaultValue: false,
      companyId,
    })
  },
})
export const toggle = mutation({
  args: { id: v.id("taxes"), isDefaultValue: v.boolean() },
  handler: async (ctx, args) => {
    await managerProcedure(ctx, {})
    return await ctx.db.patch(args.id, { isDefaultValue: !args.isDefaultValue })
  },
})
export const remove = mutation({
  args: { id: v.id("taxes") },
  handler: async (ctx, args) => {
    await managerProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})
