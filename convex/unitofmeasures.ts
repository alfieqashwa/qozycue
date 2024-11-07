import { v } from "convex/values"
import {
  createUomSchema,
  uomSchema,
} from "../types/schema/unit-of-measure-schema"
import { mutation, query } from "./_generated/server"
import { managerProcedure, protectedProcedure, zMutation } from "./helpers"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.query("unitOfMeasures").collect()
  },
})
export const create = zMutation({
  args: { createUomSchema },
  handler: async (ctx, { createUomSchema: { name, description } }) => {
    await managerProcedure(ctx, {})

    return await ctx.db.insert("unitOfMeasures", {
      name,
      description,
    })
  },
})
export const update = zMutation({
  args: { uomSchema },
  handler: async (ctx, { uomSchema: { id, name, description } }) => {
    await managerProcedure(ctx, {})

    return await ctx.db.patch(id, { name, description })
  },
})
export const remove = mutation({
  args: { id: v.id("unitOfMeasures") },
  handler: async (ctx, args) => {
    await managerProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})
