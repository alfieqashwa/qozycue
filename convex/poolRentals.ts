import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { isTimeOverlap } from "../lib/is-time-overlap"
import {
  bookingSchema,
  createBookingSchema,
  startBookingTimerSchema,
} from "../types/schema/order-schema"
import { query } from "./_generated/server"
import {
  adminProcedure,
  BATCH_SIZE,
  protectedProcedure,
  zMutation,
} from "./helpers"

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
          order: { id: order._id, statusPayment: order.statusPayment },
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

    const paidOrders =
      user !== null
        ? await ctx.db
            .query("orders")
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

    if (paidOrders.length === 0) {
      return { _count: 0, _sum: { totalCost: 0 } }
    }

    const orderIds = paidOrders.map((order) => order._id)

    /*
This implementation:
  1. Processes orders in batches of 50 to avoid potential performance issues with large datasets
  2. For each batch, fetches the associated pool rentals using Promise.all for parallel execution
  3. Filters out null rentals and updates the count and sum accordingly
  4. Returns the final aggregation object with the total count and sum

This approach is more efficient than the previous implementations shown in your commented code, as it:

  - Processes data in batches to manage memory usage
  - Uses Promise.all for parallel database queries within each batch
  - Avoids redundant processing by directly aggregating the results

For more complex aggregation needs, you might consider using Convex's Aggregate component for more scalable solutions with large datasets.
*/

    const aggregation = { _count: 0, _sum: { totalCost: 0 } }

    for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
      const batchOrderIds = orderIds.slice(i, i + BATCH_SIZE)

      const batchPoolRentals = await Promise.all(
        batchOrderIds.map(async (orderId) => {
          const poolRental = await ctx.db
            .query("poolRentals")
            .withIndex("orderId", (q) => q.eq("orderId", orderId))
            .first()
          return poolRental
        }),
      )

      // Filter out null values and update aggregation
      const validRentals = batchPoolRentals.filter((rental) => rental !== null)
      aggregation._count += validRentals.length

      // Sum up the totalCost from valid rentals
      for (const rental of validRentals) {
        aggregation._sum.totalCost += rental?.totalCost ?? 0
      }
    }
    return aggregation
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

    // Get all paid orders for the company within the date range
    const paidOrders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (paidOrders.length === 0) {
      return { _sum: { duration: 0 } }
    }

    const orderIds = paidOrders.map((order) => order._id)
    const packetIds = new Set(packets.map((packet) => packet._id.toString()))

    // Process in batches of 50
    let totalDuration = 0

    for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
      const batchOrderIds = orderIds.slice(i, i + BATCH_SIZE)

      // Process each order in the batch
      const batchResults = await Promise.all(
        batchOrderIds.map(async (orderId) => {
          // For each order, get all pool rentals
          const rentals = await ctx.db
            .query("poolRentals")
            .withIndex("orderId", (q) => q.eq("orderId", orderId))
            .collect()

          // Filter and sum client-side
          return rentals
            .filter(
              (rental) =>
                rental.packetId && packetIds.has(rental.packetId.toString()),
            )
            .reduce((sum, rental) => sum + (rental.duration ?? 0), 0)
        }),
      )

      // Sum up the batch results
      totalDuration += batchResults.reduce((sum, duration) => sum + duration, 0)
    }

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

    // Step 1: Fetch all paid orders for the user's company
    const paidOrders =
      user === null
        ? []
        : await ctx.db
            .query("orders")
            .withIndex("by_company_statuspayment", (q) =>
              q
                .eq("companyId", user.companyId!)
                .eq("statusPayment", "PAID")
                .gte("_creationTime", args.from ?? 0)
                .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
            )
            .order("desc")
            .collect()

    if (paidOrders.length === 0) {
      return [] // Return empty array if no orders found
    }
    const orderIds = paidOrders.map((order) => order._id)

    // Step 2: Fetch pool rentals in the time range for these orders
    const poolRentals = []
    for (const orderId of orderIds) {
      const rentals = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", orderId))
        .collect()
      poolRentals.push(...rentals)
    }

    if (poolRentals.length === 0) {
      return [] // Return empty array if no pool rentals found
    }

    // Step 3: Group by poolTableId aggregate
    const groupedData = poolRentals.reduce(
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
        acc[poolTableId]._sum.totalCost += rental.totalCost || 0

        return acc
      },
      {} as Record<
        string,
        { poolTableId: string; _count: number; _sum: { totalCost: number } }
      >,
    )

    // Convert grouped data into an array
    return Object.values(groupedData)
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
      companyId: user.companyId,
    })
    const orderId = await ctx.db.insert("orders", {
      companyId: user.companyId,
      createdBy: user._id,
      statusPayment: "OPEN",
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
