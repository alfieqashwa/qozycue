import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { isTimeOverlap } from "../lib/is-time-overlap"
import {
  bookingSchema,
  createBookingSchema,
  startBookingTimerSchema,
} from "../types/schema/order-schema"
import { query } from "./_generated/server"
import { protectedProcedure, zMutation } from "./helpers"

export const findAll = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user) throw new ConvexError("You do not have access!")

    const orderListByCompanyId = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    return await Promise.all(
      orderListByCompanyId.map(async (order) => {
        const poolRental = await ctx.db
          .query("poolRentals")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .filter((q) => q.eq(q.field("isBooking"), false))
          .first()
        const packet =
          poolRental !== null ? await ctx.db.get(poolRental?.packetId) : null

        const poolTable =
          poolRental !== null ? await ctx.db.get(poolRental?.poolTableId) : null

        return {
          ...poolRental,
          packet,
          poolTable: { name: poolTable?.name },
          order: { id: order._id, statusPayment: order.statusPayment },
        }
      }),
    )
  },
})

export const findAllBookingByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const bookingRentalList = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .filter((q) => q.eq(q.field("isBooking"), true))
      .collect()

    return await Promise.all(
      bookingRentalList
        .sort((p, q) => p.timeStart! - q.timeStart!)
        .map(async (poolRental) => {
          const packet = await ctx.db.get(poolRental.packetId)
          const poolTable = await ctx.db.get(poolRental.poolTableId)
          const order = await ctx.db.get(poolRental.orderId)
          const customer = await ctx.db.get(order?.customerId!)

          return {
            ...poolRental,
            packet,
            poolTable: {
              id: poolTable?._id,
              name: poolTable?.name,
              gapDuration: poolTable?.gapDuration,
            },
            order: {
              id: order?._id,
              statusPayment: order?.statusPayment,
              customer: {
                name: customer?.name,
                phone: customer?.phone,
              },
            },
          }
        }),
    )
  },
})

export const countIsBooking = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const bookingList = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .filter((q) => q.eq(q.field("isBooking"), true))
      .collect()

    return bookingList.length
  },
})

// === STARTS DASHBOARD ===
export const _sumRevenue = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    const orderList = await Promise.all(
      (orders ?? []).map(async (order) => {
        const poolRental = await ctx.db
          .query("poolRentals")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .first()
        return { ...order, poolRental }
      }),
    )

    return {
      _count: orderList.filter((order) => order.poolRental !== null),
      _sum: {
        totalCost: orderList.reduce(
          (acc, curr) => acc * (curr.poolRental?.totalCost ?? 0),
          0,
        ),
      },
    }
  },
})

export const _sumByRate = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    rate: v.union(v.literal("HOUR"), v.literal("MINUTE")),
  },
  handler: async (ctx, args) => {
    // ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    const orderList = await Promise.all(
      (orders ?? []).map(async (order) => {
        const packet = await ctx.db
          .query("packets")
          .withIndex("companyId", (q) => q.eq("companyId", order.companyId))
          .filter((q) => q.eq(q.field("rate"), args.rate))
          .unique()

        const poolRental =
          packet !== null
            ? await ctx.db
                .query("poolRentals")
                .withIndex("orderId", (q) => q.eq("orderId", order._id))
                .filter((q) => q.eq(q.field("packetId"), packet._id))
                .first()
            : null
        return {
          ...order,
          poolRental,
        }
      }),
    )
    return {
      _sum: {
        duration: orderList.reduce(
          (acc, curr) => acc * (curr.poolRental?.duration ?? 0),
          0,
        ),
      },
    }
  },
})
// === ENDS DASHBOARD ===

// === MUTATIONS ===
export const startBookingTimer = zMutation({
  args: { startBookingTimerSchema },
  handler: async (
    ctx,
    {
      startBookingTimerSchema: {
        openAndNotBookingOrderId,
        orderId,
        poolTableId,
        startTime,
        endTime,
      },
    },
  ) => {
    await protectedProcedure(ctx, {})
    // if there's an open order but has false is_booking pool_rental:
    const resetLatestOpenOrder =
      openAndNotBookingOrderId != null
        ? await ctx.db.patch(openAndNotBookingOrderId, {
            statusPayment: "PENDING",
          })
        : null

    const updateBookingOrder = await ctx.db.patch(orderId, {
      statusPayment: "OPEN",
    })
    const updatePoolTable = await ctx.db.patch(poolTableId, {
      isActive: true,
      startTime,
      endTime,
    })

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", orderId))
      .unique()
    const updatePoolRental = await ctx.db.patch(poolRental?._id!, {
      isBooking: false,
    })

    return {
      resetLatestOpenOrder,
      updatePoolTable,
      updatePoolRental,
      updateBookingOrder,
    }
  },
})

export const createBooking = zMutation({
  args: { createBookingSchema },
  handler: async (
    ctx,
    {
      createBookingSchema: {
        gapDuration,
        startTime,
        customerName,
        customerPhone,
        poolTableId,
        packetId,
        duration,
        cost,
      },
    },
  ) => {
    await protectedProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user?.companyId) throw new ConvexError("No company provided!")

    const listOfPoolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTableId))
      .collect()

    const listOfRentalTime = await Promise.all(
      listOfPoolRental
        .filter(async (rental) => {
          const order = await ctx.db
            .query("orders")
            .withIndex("by_id", (q) => q.eq("_id", rental.orderId))
            .filter((q) => q.eq(q.field("statusPayment"), "OPEN"))
            .first()

          return rental.orderId === order?._id
        })
        .map((rental) => ({
          timeStart: rental.timeStart,
          timeEnd: rental.timeEnd,
        }))
        .sort((p, q) => p.timeStart! - q.timeStart!),
    )
    const HOUR_TO_MILLISECOND = 60 * 60 * 1000
    // const startTime = Date.now()
    // const endTime = startTime + duration * HOUR_TO_MILLISECOND
    const endTime = startTime + duration * HOUR_TO_MILLISECOND
    const totalCost = Math.round(((cost * duration) / 100) * 100)

    const hasConflict = isTimeOverlap(
      gapDuration,
      startTime,
      endTime,
      listOfRentalTime,
    )
    if (hasConflict) {
      throw new ConvexError("The selected time overlaps with another booking.")
    }

    const customerId = await ctx.db.insert("customers", {
      name: customerName,
      phone: customerPhone,
      companyId: user?.companyId,
    })
    const orderId = await ctx.db.insert("orders", {
      companyId: user.companyId,
      createdBy: user._id,
      statusPayment: "OPEN",
      customerId,
    })
    const poolRentalId = await ctx.db.insert("poolRentals", {
      isBooking: true,
      orderId,
      poolTableId,
      packetId,
      duration,
      totalCost,
      timeStart: startTime,
      timeEnd: endTime,
    })

    return {
      customerId,
      orderId,
      poolRentalId,
    }
  },
})

export const updateBooking = zMutation({
  args: { bookingSchema },
  handler: async (
    ctx,
    {
      bookingSchema: {
        gapDuration,
        orderId,
        poolTableId,
        startTime,
        customerName,
        customerPhone,
        packetId,
        duration,
        cost,
      },
    },
  ) => {
    await protectedProcedure(ctx, {})

    const listOfPoolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTableId))
      .filter((q) => q.neq(q.field("orderId"), orderId)) // exclude orderId from the args
      .collect()

    const listOfRentalTime = await Promise.all(
      listOfPoolRental
        .filter(async (rental) => {
          const order = await ctx.db
            .query("orders")
            .withIndex("by_id", (q) => q.eq("_id", rental.orderId))
            .filter((q) => q.eq(q.field("statusPayment"), "OPEN"))
            .first()
          return rental.orderId === order?._id
        })
        .map((rental) => ({
          timeStart: rental.timeStart,
          timeEnd: rental.timeEnd,
        }))
        .sort((p, q) => p.timeStart! - q.timeStart!),
    )

    const HOUR_TO_MILLISECOND = 60 * 60 * 1000
    const endTime = startTime + duration * HOUR_TO_MILLISECOND
    const totalCost = Math.round((cost * duration) / 100) * 100

    const hasConflict = isTimeOverlap(
      gapDuration,
      startTime,
      endTime,
      listOfRentalTime,
    )
    if (hasConflict) {
      throw new ConvexError("The selected time overlaps with another booking.")
    }

    const order = await ctx.db.get(orderId)
    if (!order) throw new ConvexError("No Order provided!")

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order?._id))
      .first()

    if (!poolRental) throw new ConvexError("No Pool Rental provided!")
    const updatePoolRental = await ctx.db.patch(poolRental?._id, {
      packetId,
      duration,
      totalCost,
      timeStart: startTime,
      timeEnd: endTime,
    })

    const updateCustomer = await ctx.db.patch(order.customerId!, {
      name: customerName,
      phone: customerPhone,
    })

    return { updatePoolRental, updateCustomer }
  },
})
