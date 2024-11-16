import { ConvexError, v } from "convex/values"
import { query } from "./_generated/server"
import { protectedProcedure, zMutation } from "./helpers"
import {
  createBookingSchema,
  startBookingTimerSchema,
} from "../types/schema/order-schema"
import { isTimeOverlap } from "../lib/is-time-overlap"
import { getAuthUserId } from "@convex-dev/auth/server"

export const findAllBookingByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const bookingRentalList = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .filter((q) => q.eq(q.field("isBooking"), true))
      .collect()

    return Promise.all(
      bookingRentalList
        .sort((p, q) => p.timeStart - q.timeStart)
        .map(async (poolRental) => {
          const packet = !!poolRental.packetId
            ? await ctx.db.get(poolRental.packetId)
            : null
          const poolTable = !!poolRental.poolTableId
            ? await ctx.db.get(poolRental.poolTableId)
            : null
          const order = !!poolRental.orderId
            ? await ctx.db.get(poolRental.orderId)
            : null
          const customer = !!order?.customerId
            ? await ctx.db.get(order.customerId)
            : null

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

    // if there's an open order but has false is_booking pool_rental:
    if (!!openAndNotBookingOrderId) {
      const resetLatestOpenOrder = await ctx.db.patch(orderId, {
        statusPayment: "PENDING",
      })

      return {
        resetLatestOpenOrder,
        updatePoolTable,
        updatePoolRental,
      }
    }

    return { updatePoolTable, updatePoolRental }
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

    const listOfRentalTime = listOfPoolRental
      .filter(async (rental) => {
        const order = await ctx.db.get(rental.orderId)
        return order?.statusPayment === "OPEN"
      })
      .sort((p, q) => p.timeStart - q.timeStart)
      .map((rental) => ({
        timeStart: rental.timeStart,
        timeEnd: rental.timeEnd,
      }))

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
