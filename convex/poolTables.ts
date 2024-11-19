import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createPoolTableSchema,
  togglePoolSchema,
  updateGapDurationSchema,
  updatePoolTableSchema,
} from "../types/schema/pool-table-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  cashierProcedure,
  protectedProcedure,
  subscriptions,
  validateSubscriptionLimits,
  zMutation,
} from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    //? a.k.a -> protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    const pooltables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .collect()

    return Promise.all(
      pooltables.map(async (pool) => {
        const company = await ctx.db.get(pool.companyId)
        return { ...pool, company: { isPublished: company?.isPublished } }
      }),
    )
  },
})

export const findById = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, { poolTableId }) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.get(poolTableId)
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
      description: `table ${name} ${company?.name ?? ""}`,
      isActive: false,
      status: "disabled",
      gapDuration: 10,
      startTime: null,
      endTime: null,
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
      description: `table ${name} ${company?.name ?? ""}`,
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
  args: { togglePoolSchema },
  handler: async (ctx, { togglePoolSchema: { id, status } }) => {
    await adminProcedure(ctx, {})

    return await ctx.db.patch(id, {
      status: status === "enabled" ? "disabled" : "enabled",
    })
  },
})

export const transfer = mutation({
  args: {
    orderId: v.id("orders"),
    poolTableIdFrom: v.id("poolTables"),
    poolTableIdTo: v.id("poolTables"),
    startTime: v.float64(),
    endTime: v.union(v.null(), v.float64()),
  },
  handler: async (ctx, args) => {
    await cashierProcedure(ctx, {})

    const startPoolTableTo = await ctx.db.patch(args.poolTableIdTo, {
      startTime: args.startTime,
      endTime: args.endTime,
      isActive: true,
    })

    const resetPoolTableFrom = await ctx.db.patch(args.poolTableIdFrom, {
      isActive: false,
      startTime: null,
      endTime: null,
    })

    const findPoolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", args.orderId))
      .first()

    if (!findPoolRental) throw new ConvexError("No PoolRental found!")

    const transferTable = await ctx.db.patch(findPoolRental?._id, {
      poolTableId: args.poolTableIdTo,
    })
    return { startPoolTableTo, resetPoolTableFrom, transferTable }
  },
})
export const transferPoolTableList = query({
  args: { poolTableIdFrom: v.id("poolTables") },
  handler: async (ctx, args) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    const poolTableListByCompany = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) =>
        q.and(
          q.neq(q.field("_id"), args.poolTableIdFrom),
          q.neq(q.field("status"), "disabled"),
          q.eq(q.field("isActive"), false),
          q.eq(q.field("startTime"), null),
        ),
      )
      .collect()

    const poolTableList = await Promise.all(
      (poolTableListByCompany ?? []).map(async (pool) => {
        const poolRental = await ctx.db
          .query("poolRentals")
          .withIndex("poolTableId", (q) => q.eq("poolTableId", pool._id))
          .first()

        return {
          ...pool,
          poolRental,
        }
      }),
    )

    return poolTableList
      .filter((pool) => pool.poolRental?.isBooking !== true)
      .sort((p, q) =>
        p.name.localeCompare(q.name, undefined, { numeric: true }),
      )
  },
})

export const findGapDuration = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, { poolTableId }) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.get(poolTableId)
  },
})

export const updateGapDuration = zMutation({
  args: { updateGapDurationSchema },
  handler: async (
    ctx,
    { updateGapDurationSchema: { poolTableId, gapDuration } },
  ) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.patch(poolTableId, { gapDuration })
  },
})
