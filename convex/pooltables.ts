import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createPoolTableSchema,
  toggleSchema,
  updatePoolTableSchema,
} from "../types/schema/pool-table-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  subscriptions,
  validateSubscriptionLimits,
  zMutation,
} from "./helpers"

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    //? a.k.a -> protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")

    const pooltables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()

    return Promise.all(
      pooltables.map(async (pool) => {
        const company = await ctx.db.get(pool.companyId)
        return { ...pool, isPublished: company?.isPublished }
      }),
    )
  },
})

export const create = zMutation({
  args: { createPoolTableSchema },
  handler: async (ctx, { createPoolTableSchema: { name, companyId } }) => {
    await adminProcedure(ctx, {})

    const subs = await subscriptions(ctx, { companyId })
    const isValid = validateSubscriptionLimits({
      subscription: subs.subscription!,
      poolTableLen: subs._count.poolTables,
    })
    if (!isValid) throw new ConvexError("Max poolTable limit exceeded!")

    const company = await ctx.db.get(companyId)
    return await ctx.db.insert("poolTables", {
      companyId,
      name,
      description: `table ${name} of ${company?.name ?? ""}`,
      isActive: false,
      status: "disabled",
      gapDuration: 10,
      startTime: undefined,
      endTime: undefined,
    })
  },
})

export const update = zMutation({
  args: { updatePoolTableSchema },
  handler: async (ctx, { updatePoolTableSchema: { id, name, companyId } }) => {
    await adminProcedure(ctx, {})

    const company = await ctx.db.get(companyId!)
    return await ctx.db.patch(id, {
      name,
      description: `table ${name} of ${company?.name ?? ""}`,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("poolTables") },
  handler: async (ctx, { id }) => {
    await adminProcedure(ctx, {})

    return await ctx.db.delete(id)
  },
})

export const toggle = zMutation({
  args: { toggleSchema },
  handler: async (ctx, { toggleSchema: { id, status } }) => {
    await adminProcedure(ctx, {})

    return await ctx.db.patch(id, {
      status: status === "enabled" ? "disabled" : "enabled",
    })
  },
})
