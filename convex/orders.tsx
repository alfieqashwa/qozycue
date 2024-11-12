import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { cashierProcedure, protectedProcedure, zQuery } from "./helpers"
import { getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"

export const findAll = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    return await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()
  },
})
export const findAllSortedByDate = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    // notEqual: v.array(
    //   v.union(
    //     v.literal("OPEN"),
    //     v.literal("PENDING"),
    //     v.literal("PAID"),
    //     v.literal("ARCHIVE"),
    //   ),
    // ),
  },
  handler: async (ctx, args) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    // src -> https://docs.convex.dev/database/reading-data#filtering
    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("isBooking"), false),
          // q.neq(q.field("statusPayment"), args.notEqual),
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    return Promise.all(
      (orders ?? []).map(async (order) => {
        const poolRental = await ctx.db
          .query("poolRentals")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .unique()
        const poolTable = await ctx.db.get(poolRental?.poolTableId!)
        const orderlines = await ctx.db
          .query("orderlines")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect()
        const customer = order.customerId
          ? await ctx.db.get(order.customerId)
          : undefined

        return {
          ...order,
          poolRental: {
            poolTable: {
              id: poolTable?._id,
              name: poolTable?.name,
            },
          },
          orderlines,
          createdBy: {
            name: user?.name,
            role: user?.role,
          },
          customer: {
            name: customer?.name,
            phone: customer?.phone,
          },
        }
      }),
    )
  },
})

export const findById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.get(args.id)
  },
})

export const findByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .first()

    const order =
      poolRental !== null
        ? await ctx.db
            .query("orders")
            .withIndex("by_id", (q) => q.eq("_id", poolRental?.orderId))
            .filter((q) =>
              q.and(
                q.eq(q.field("statusPayment"), "OPEN"),
                q.eq(q.field("isBooking"), false),
              ),
            )
            .first()
        : null

    return order
  },
})

// MUTATION

export const startTimer = mutation({
  args: {
    poolTableId: v.id("poolTables"),
    gapDuration: v.number(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    packetId: v.id("packets"),
    duration: v.number(),
    cost: v.float64(),
    rate: v.union(v.literal("MINUTE"), v.literal("HOUR")),
  },
  handler: async (ctx, args) => {
    // cashierProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    if (!user.companyId) throw new ConvexError("No company provided!")

    const HOUR_TO_MILLISECOND = 60 * 60 * 1000
    const startTime = Date.now()
    const endTime = startTime + args.duration * HOUR_TO_MILLISECOND

    const updatePoolTable = await ctx.db.patch(args.poolTableId, {
      isActive: true,
      startTime,
      endTime: args.rate === "HOUR" ? endTime : undefined,
    })

    const totalCost = Math.round((args.cost * args.duration) / 100) * 100

    const customerId = await ctx.db.insert("customers", {
      name: args.customerName ?? "anonymous",
      phone: args.customerPhone,
      companyId: user.companyId,
    })

    const orderId = await ctx.db.insert("orders", {
      createdBy: user._id,
      companyId: user.companyId,
      isBooking: false,
      statusPayment: "OPEN",
      customerId,
    })

    const createOrder = await ctx.db.insert("poolRentals", {
      orderId,
      poolTableId: args.poolTableId,
      packetId: args.packetId,
      duration: args.duration,
      totalCost,
      timeStart: startTime,
      timeEnd: args.rate === "HOUR" ? endTime : undefined,
    })

    return { updatePoolTable, createOrder }
  },
})
