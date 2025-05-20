import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { isTimeOverlap } from "../lib/is-time-overlap"
import {
  bookingSchema,
  createBookingSchema,
  startBookingTimerSchema,
} from "../types/schema/order-schema"
import { query } from "./_generated/server"
import { adminProcedure, protectedProcedure, zMutation } from "./helpers"

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
      .withIndex("companyId", (q) =>
        q
          .eq("companyId", user.companyId!)
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (orderListByCompanyId.length === 0) return []

    const filteredOrders = []

    for (const order of orderListByCompanyId) {
      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .first()
      if (poolRental) {
        const packet = await ctx.db.get(poolRental?.packetId)
        const poolTable = await ctx.db.get(poolRental?.poolTableId)

        filteredOrders.push({
          ...poolRental,
          packet,
          poolTable: { name: poolTable?.name },
          order: { id: order._id },
        })
      }
    }

    return filteredOrders
  },
})

export const findAllBookingByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const bookingRentalList = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", true),
      )
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
export const findAllBookingByPoolTableIdPublicProcedure = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    const bookingRentalList = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", true),
      )
      .collect()

    return bookingRentalList
      .sort((p, q) => p.timeStart - q.timeStart)
      .map((rental) => ({
        timeStart: rental.timeStart,
        timeEnd: rental.timeEnd,
        duration: rental.duration,
      }))
  },
})

export const findByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await adminProcedure(ctx)

    return await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .first()
  },
})

export const findByPacketId = query({
  args: { packetId: v.id("packets") },
  handler: async (ctx, { packetId }) => {
    await adminProcedure(ctx)

    return await ctx.db
      .query("poolRentals")
      .withIndex("packetId", (q) => q.eq("packetId", packetId))
      .first()
  },
})

export const countIsBooking = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const bookingList = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", true),
      )
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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")
    if (!user?.companyId) return null

    const paidPoolRentals =
      user !== null
        ? await ctx.db
            .query("poolRentals")
            .withIndex("by_company_statuspayment", (q) =>
              q
                .eq("companyId", user.companyId!)
                .eq("statusPayment", "PAID")
                .gte("_creationTime", args.from ?? 0)
                .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
            )
            .order("desc")
            .collect()
        : []

    if (paidPoolRentals.length === 0) {
      return { _count: 0, _sum: { totalCost: 0 } }
    }

    return paidPoolRentals.reduce(
      (acc, rental) => {
        acc._count += 1
        acc._sum.totalCost += rental.totalCost ?? 0
        return acc
      },
      {
        _count: 0,
        _sum: { totalCost: 0 },
      },
    )
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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")
    if (!user?.companyId) return { _sum: { duration: 0 } }

    // Get packets with the specified rate for this company
    const packets = await ctx.db
      .query("packets")
      .withIndex("by_company_rate", (q) =>
        q.eq("companyId", user.companyId!).eq("rate", args.rate),
      )
      .collect()

    if (packets.length === 0) {
      return { _sum: { duration: 0 } }
    }

    // Get all paid pool rentals  for the company within the date range
    const paidPoolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (paidPoolRentals.length === 0) {
      return { _sum: { duration: 0 } }
    }

    const packetIds = new Set(packets.map((packet) => packet._id))

    const totalDuration = paidPoolRentals
      .filter((rental) => rental.packetId && packetIds.has(rental.packetId))
      .reduce((sum, rental) => sum + (rental.duration ?? 0), 0)

    // Normalize duration if requested in hours
    const normalizedDuration =
      args.rate === "MINUTE" ? totalDuration / 60 : totalDuration

    return {
      _sum: { duration: normalizedDuration }, // expecting duration in hours
    }
  },
})

export const _groupByPoolTableId = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    // Step 1: Fetch all PAID orders for within the time range
    const paidPoolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (paidPoolRentals.length === 0) return []

    // Step 2: Fetch all pool rentals for those orders

    // Step 3: Group  rentals by poolTableId
    const rentalStats = paidPoolRentals.reduce(
      (acc, rental) => {
        const poolTableId = rental.poolTableId.toString()

        if (!acc[poolTableId]) {
          acc[poolTableId] = {
            poolTableId: rental.poolTableId,
            _count: 0,
            _sum: { totalCost: 0 },
          }
        }

        acc[poolTableId]._count += 1
        acc[poolTableId]._sum.totalCost += rental.totalCost ?? 0

        return acc
      },
      {} as Record<
        string,
        { poolTableId: string; _count: number; _sum: { totalCost: number } }
      >,
    )

    const poolTables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .collect()

    // Return enirched and sorted results
    return Object.values(rentalStats)
      .map((stat) => ({
        name: `Table ${poolTables.find((pool) => pool._id === stat.poolTableId)?.name}`,
        total: stat._sum.totalCost,
        count: stat._count,
      }))
      .filter((p) => !!p.name) // exclude cafe-only
      .sort((p, q) =>
        p!.name.localeCompare(q!.name, undefined, { numeric: true }),
      )
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
    await protectedProcedure(ctx)
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
    await protectedProcedure(ctx)
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user?.companyId) throw new ConvexError("No company provided!")

    const statusPayment = "OPEN"

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
            .filter((q) => q.eq(q.field("statusPayment"), statusPayment))
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
      companyId: user.companyId,
    })
    const orderId = await ctx.db.insert("orders", {
      companyId: user.companyId,
      createdBy: user._id,
      statusPayment,
      customerId,
      isDeleted: false,
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
      statusPayment,
      companyId: user.companyId,
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
    await protectedProcedure(ctx)

    const listOfPoolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTableId))
      .filter((q) => q.neq(q.field("orderId"), orderId)) // exclude orderId from the args
      .collect()

    // const listOfRentalTime = await Promise.all(
    //   listOfPoolRental
    //     .filter(async (rental) => {
    //       const order = await ctx.db
    //         .query("orders")
    //         .withIndex("by_id", (q) => q.eq("_id", rental.orderId))
    //         .filter((q) => q.eq(q.field("statusPayment"), "OPEN"))
    //         .first()
    //       return rental.orderId === order?._id
    //     })
    //     .map((rental) => ({
    //       timeStart: rental.timeStart,
    //       timeEnd: rental.timeEnd,
    //     }))
    //     .sort((p, q) => p.timeStart! - q.timeStart!),
    // )

    // find the existing open poolRental within the same poolTable
    const listOfRentalTime = listOfPoolRental
      .filter((rental) => rental.statusPayment === "OPEN")
      .map((rental) => ({
        timeStart: rental.timeStart,
        timeEnd: rental.timeEnd,
      }))

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
