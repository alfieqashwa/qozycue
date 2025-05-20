import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { isTimeOverlap } from "../lib/is-time-overlap"
import {
  startTimerSchema,
  stopTimerSchema,
  updateDurationSchema,
} from "../types/schema/order-schema"
import { submitPaymentSchema } from "../types/schema/payment-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  BATCH_SIZE,
  cashierProcedure,
  managerProcedure,
  protectedProcedure,
  zMutation,
} from "./helpers"

export const findAll = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

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
    notEqual: v.union(
      v.literal("OPEN"),
      v.literal("CANCELLED"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("ARCHIVE"),
    ),
  },
  handler: async (ctx, args) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    // src -> https://docs.convex.dev/database/reading-data#filtering
    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .filter((q) => q.neq(q.field("statusPayment"), args.notEqual))
      .order("desc")
      .collect()

    if (orders.length === 0) return []

    const filteredOrders = []
    for (const order of orders) {
      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .first()

      const poolTable = poolRental
        ? await ctx.db.get(poolRental?.poolTableId)
        : null
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      const customer = order.customerId
        ? await ctx.db.get(order.customerId)
        : undefined

      const createdBy = order.createdBy
        ? await ctx.db.get(order.createdBy)
        : undefined
      const updatedBy = order.updatedBy
        ? await ctx.db.get(order.updatedBy)
        : undefined

      filteredOrders.push({
        ...order,
        poolRental: {
          isBooking: poolRental?.isBooking,
          poolTable: {
            id: poolTable?._id,
            name: poolTable?.name,
          },
        },
        orderlines,
        createdBy: {
          name: createdBy?.name,
          role: createdBy?.role,
        },
        updatedBy: {
          name: updatedBy?.name,
          role: updatedBy?.role,
        },
        customer: {
          name: customer?.name,
          phone: customer?.phone,
        },
      })
    }

    return filteredOrders
  },
})

export const findAllArchiveOrderSortedByDate = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    equal: v.union(
      v.literal("OPEN"),
      v.literal("CANCELLED"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("ARCHIVE"),
    ),
  },
  handler: async (ctx, args) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    // src -> https://docs.convex.dev/database/reading-data#filtering
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .eq("statusPayment", args.equal)
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (orders.length === 0) return []

    const filteredOrders = []
    for (const order of orders) {
      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("by_order_isbooking", (q) =>
          q.eq("orderId", order._id).eq("isBooking", false),
        )
        .first()

      const poolTable = poolRental
        ? await ctx.db.get(poolRental?.poolTableId)
        : null

      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      const customer = order.customerId
        ? await ctx.db.get(order.customerId)
        : undefined

      const createdBy = order.createdBy
        ? await ctx.db.get(order.createdBy)
        : undefined
      const updatedBy = order.updatedBy
        ? await ctx.db.get(order.updatedBy)
        : undefined

      filteredOrders.push({
        ...order,
        poolRental: {
          poolTable: {
            id: poolTable?._id,
            name: poolTable?.name,
          },
        },
        orderlines,
        createdBy: {
          name: createdBy?.name,
          role: createdBy?.role,
        },
        updatedBy: {
          name: updatedBy?.name,
          role: updatedBy?.role,
        },
        customer: {
          name: customer?.name,
          phone: customer?.phone,
        },
      })
    }

    return filteredOrders
  },
})

export const findAllBookingByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q.eq("companyId", args.companyId).eq("statusPayment", "OPEN"),
      )
      .collect()

    const filteredBookingOrders = []
    for (const order of orders) {
      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("by_order_isbooking", (q) =>
          q.eq("orderId", order._id).eq("isBooking", true),
        )
        .first()
      const createdBy = await ctx.db.get(order.createdBy)
      const customer = order.customerId
        ? await ctx.db.get(order.customerId)
        : null

      filteredBookingOrders.push({
        ...order,
        createdBy: { name: createdBy?.name, role: createdBy?.role },
        customer: { name: customer?.name, phone: customer?.phone },
        poolRental,
      })
    }

    return filteredBookingOrders
  },
})

export const findById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const order = await ctx.db.get(args.id)
    if (!order) throw new ConvexError("Order not found!")

    const createdBy = await ctx.db.get(order.createdBy)
    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .first()

    const customer = order.customerId
      ? await ctx.db.get(order.customerId)
      : undefined
    const company = await ctx.db.get(order.companyId)
    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .collect()
    const packet =
      poolRental !== null ? await ctx.db.get(poolRental.packetId) : null

    return {
      ...order,
      poolRental: {
        ...poolRental,
        packet: { name: packet?.name, cost: packet?.cost, rate: packet?.rate },
      },
      company: {
        name: company?.name,
        phone: company?.phone,
        location: company?.location,
      },
      customer: { name: customer?.name, phone: customer?.phone },
      createdBy: { name: createdBy?.name },
      orderlinesLen: orderlines.length,
    }
  },
})

export const findByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const poolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", false),
      )
      .collect()

    const filteredOrderlist = []
    for (const rental of poolRentals) {
      const order = await ctx.db.get(rental.orderId)
      // Skip this rental if the order is null
      if (order === null) continue

      const packet = await ctx.db.get(rental.packetId)
      const customer = order.customerId
        ? await ctx.db.get(order.customerId!)
        : null
      // Only try to get createdBy if order exists and has a createdBy field
      const createdBy = order.createdBy
        ? await ctx.db.get(order.createdBy)
        : null

      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      filteredOrderlist.push({
        ...order,
        customer: { name: customer?.name, phone: customer?.phone },
        createdBy: { name: createdBy?.name },
        orderlinesLen: orderlines.length,
        poolRental: {
          ...rental,
          packet: {
            name: packet?.name,
            cost: packet?.cost,
            rate: packet?.rate,
          },
        },
      })
    }

    return filteredOrderlist.find((order) => order.statusPayment === "OPEN")
  },
})

export const findByPoolTableIdPublicProcedure = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    const poolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", false),
      )
      .collect()

    const filteredOrderlist = []
    for (const rental of poolRentals) {
      const order = await ctx.db.get(rental.orderId)
      const packet = await ctx.db.get(rental.packetId)

      filteredOrderlist.push({
        ...order,
        poolRental: {
          ...rental,
          packet: {
            name: packet?.name,
            cost: packet?.cost,
            rate: packet?.rate,
          },
        },
      })
    }

    return filteredOrderlist.find((order) => order.statusPayment === "OPEN")
  },
})

export const findAllPendingStatusByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

    const poolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", args.poolTableId).eq("isBooking", false),
      )
      .collect()

    if (poolRentals.length === 0) return []

    const filteredOrderlist = []
    for (const rental of poolRentals) {
      const order = await ctx.db
        .query("orders")
        .withIndex("by_id", (q) => q.eq("_id", rental.orderId))
        .first()
      const packet = await ctx.db.get(rental.packetId!)
      const customer = await ctx.db.get(order?.customerId!)
      const createdBy = await ctx.db.get(order?.createdBy!)
      const orderlines =
        order !== null
          ? await ctx.db
              .query("orderlines")
              .withIndex("orderId", (q) => q.eq("orderId", order?._id!))
              .collect()
          : []

      filteredOrderlist.push({
        ...order,
        customer: { name: customer?.name, phone: customer?.phone },
        createdBy: { name: createdBy?.name },
        orderlinesLen: orderlines.length,
        poolRental: {
          ...rental,
          packet: {
            name: packet?.name,
            cost: packet?.cost,
            rate: packet?.rate,
          },
        },
      })
    }

    return filteredOrderlist.filter(
      (order) => order.statusPayment === "PENDING",
    )
  },
})

export const countPendingStatus = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, { poolTableId }) => {
    await protectedProcedure(ctx)

    const poolRentalList = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTableId))
      .collect()

    const poolRentalListWithOrder = []

    for (const rental of poolRentalList) {
      const order =
        rental.orderId !== null ? await ctx.db.get(rental.orderId) : null
      poolRentalListWithOrder.push({ ...rental, order })
    }

    return poolRentalListWithOrder.filter(
      (rental) => rental.order?.statusPayment === "PENDING",
    ).length
  },
})

export const findAllCafeOnlyByCompanyId = query({
  args: {},
  handler: async (ctx) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q.eq("companyId", user?.companyId!).eq("statusPayment", "OPEN"),
      )
      .order("desc")
      .collect()

    if (orders.length === 0) return []

    const filteredCafeOnlyOrders = []
    for (const order of orders) {
      const createdBy = await ctx.db.get(order.createdBy)
      const customer = await ctx.db.get(order.customerId!)
      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .first()
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .order("desc")
        .collect()
      filteredCafeOnlyOrders.push({
        ...order,
        createdBy: { name: createdBy?.name, role: createdBy?.role },
        customer,
        poolRental,
        orderlinesLen: orderlines.length,
      })
    }

    return filteredCafeOnlyOrders.filter((f) => f.poolRental == null)
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

    if (!user?.companyId) {
      return { _count: 0, _sum: { totalAmount: 0, revenue: 0 } }
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .collect()

    const _count = orders.length
    const totalAmount = orders.reduce(
      (acc, curr) => acc + (curr.totalAmount ?? 0),
      0,
    )
    const revenue = orders.reduce((acc, curr) => acc + (curr.revenue ?? 0), 0)

    return {
      _count,
      _sum: {
        totalAmount,
        revenue,
      },
    }
  },
})

export const _groupByPaymentMethod = query({
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

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q.eq("companyId", user?.companyId!).eq("statusPayment", "PAID"),
      )
      .filter((q) =>
        q.and(
          args.from ? q.gt(q.field("_creationTime"), args.from) : true,
          args.to ? q.lte(q.field("_creationTime"), args.to) : true,
        ),
      )
      .collect()

    // src -> https://chatgpt.com/c/6745f1d2-bc58-8002-adf2-8257016d66a0
    // Group by paymentMethod
    const grouped = orders.reduce(
      (acc, order) => {
        const paymentMethod = order.paymentMethod as string

        if (!acc[paymentMethod]) {
          acc[paymentMethod] = {
            _count: 0,
            _sum: { totalAmount: 0 },
          }
        }

        acc[paymentMethod]._count += 1
        acc[paymentMethod]._sum.totalAmount += order.totalAmount || 0

        return acc
      },
      {} as Record<string, { _count: number; _sum: { totalAmount: number } }>,
    )

    // Convert the grouped object to an array and sort by paymentMethod (descending)
    const sorted = Object.entries(grouped)
      .map(([paymentMethod, data]) => ({
        paymentMethod,
        ...data,
      }))
      .sort((a, b) => (a.paymentMethod < b.paymentMethod ? 1 : -1))

    return sorted
  },
})

export const printTransaction = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // Auth check: ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    // Step 1: Fetch all paid orders for the user's company with time filter
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (orders.length === 0) {
      return { orderList: [], totalRevenue: 0, totalTransaction: 0 }
    }

    // Step 2: Process orders in batches
    const orderList = []
    let totalRevenue = 0

    for (let i = 0; i < orders.length; i += BATCH_SIZE) {
      const batchOrders = orders.slice(i, i + BATCH_SIZE)

      // Process each batch in parallel
      const batchResults = await Promise.all(
        batchOrders.map(async (order) => {
          // Fetch related data in parallel
          const [poolRental, createdBy, customer] = await Promise.all([
            ctx.db
              .query("poolRentals")
              .withIndex("orderId", (q) => q.eq("orderId", order._id))
              .first(),
            ctx.db.get(order.createdBy),
            order.customerId ? ctx.db.get(order.customerId) : null,
          ])

          // Fetch pool table if poolRental exists
          const poolTable = poolRental
            ? await ctx.db.get(poolRental.poolTableId)
            : null

          // Calculate running total
          if (order.totalAmount != null) {
            totalRevenue += order.totalAmount
          }
          // Return enriched order
          return {
            ...order,
            poolRental: {
              poolTable: {
                name: poolTable?.name,
              },
            },
            createdBy: {
              name: createdBy?.name,
              role: createdBy?.role,
            },
            customer: {
              name: customer?.name,
              phone: customer?.phone,
            },
          }
        }),
      )
      // Add batch results to orderList
      orderList.push(...batchResults)
    }

    return {
      orderList,
      totalRevenue,
      totalTransaction: orders.length,
    }
  },
})

// === ENDS DASHBOARD ===

// === MUTATION ===

export const startTimer = zMutation({
  args: {
    startTimerSchema,
  },
  handler: async (
    ctx,
    {
      startTimerSchema: {
        poolTableId,
        gapDuration,
        customerName,
        customerPhone,
        packetId,
        duration,
        cost,
        rate,
      },
    },
  ) => {
    // cashierProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (!["ZENITH", "ADMIN", "CASHIER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) throw new ConvexError("No company provided!")

    // === STARTS Config Conflict Validation ===
    const listOfPoolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTableId))
      .collect()

    const listOfRentalTime = (
      await Promise.all(
        listOfPoolRental.map(async (rental) => {
          const order = await ctx.db
            .query("orders")
            .withIndex("by_id", (q) => q.eq("_id", rental.orderId))
            .filter((q) => q.eq(q.field("statusPayment"), "OPEN"))
            .first()

          // filtered only the open statusPayment orders
          if (rental.orderId === order?._id) {
            return {
              timeStart: rental.timeStart,
              timeEnd: rental.timeEnd,
            }
          }
          return null
        }),
      )
    )
      .filter((rental) => rental !== null)
      .sort((p, q) => p!.timeStart! - q!.timeStart!)

    const HOUR_TO_MILLISECOND = 60 * 60 * 1000
    const startTime = Date.now()
    const endTime = startTime + duration * HOUR_TO_MILLISECOND

    const hasConflict = isTimeOverlap(
      gapDuration,
      startTime,
      endTime,
      listOfRentalTime as { timeStart: number; timeEnd: number }[],
    )

    if (hasConflict) {
      throw new ConvexError("The selected time overlaps with another booking.")
    }
    // === ENDS Config Conflict Validation ===

    const statusPayment = "OPEN"
    const totalCost = Math.round((cost * duration) / 100) * 100

    const updatePoolTable = await ctx.db.patch(poolTableId, {
      isActive: true,
      startTime,
      endTime: rate === "HOUR" ? endTime : null,
    })

    const customerId = await ctx.db.insert("customers", {
      name: customerName ?? "anonymous",
      phone: customerPhone,
      companyId: user.companyId,
    })

    const orderId = await ctx.db.insert("orders", {
      createdBy: user._id,
      companyId: user.companyId,
      statusPayment,
      customerId,
      isDeleted: false,
    })

    const createOrder = await ctx.db.insert("poolRentals", {
      orderId,
      poolTableId,
      packetId: packetId,
      duration: duration,
      totalCost,
      timeStart: startTime,
      timeEnd: rate === "HOUR" ? endTime : null,
      isBooking: false,
      statusPayment,
      companyId: user.companyId,
    })

    return { updatePoolTable, createOrder }
  },
})

export const stopTimer = zMutation({
  args: { stopTimerSchema },
  handler: async (
    ctx,
    {
      stopTimerSchema: {
        poolTableId,
        poolRentalId,
        startTime,
        endTime,
        cost,
        rate,
      },
    },
  ) => {
    if (!startTime || !endTime || startTime >= endTime) {
      throw new ConvexError("Invalid startTime and endTime")
    }

    //? Calculate duration in minute-rate
    const elapsedTime = endTime - startTime
    const elapsedInMinutes = Math.floor(elapsedTime / (1000 * 60))

    /*
    Commented out this and keep default calculation until there're request for this implementation

    const ONE_HOUR_IN_MILLISECONDS = 1_000 * 60 * 60
    const oneHourInMinutes = Math.floor(ONE_HOUR_IN_MILLISECONDS / (1000 * 60))

    //? If duration is less than one hour, than cust must pay as 1hr totalCost
    if (elapsedTime < ONE_HOUR_IN_MILLISECONDS) {
      totalCostInMinutes = cost * oneHourInMinutes
    } else {
      totalCostInMinutes = cost * elapsedInMinutes
    }
    */

    //? Calculate totalCost in minute-rate
    const totalCostInMinutes = cost * elapsedInMinutes

    const totalCost = Math.round(totalCostInMinutes / 100) * 100

    try {
      const updatePoolTable = await ctx.db.patch(poolTableId, {
        isActive: false,
        endTime,
      })

      if (rate === "MINUTE") {
        const updatePoolRental = await ctx.db.patch(poolRentalId, {
          duration: elapsedInMinutes,
          totalCost,
          timeEnd: endTime,
        })
        return { updatePoolRental, updatePoolTable }
      } else {
        const updatePoolRental = await ctx.db.patch(poolRentalId, {
          timeEnd: endTime,
        })
        return { updatePoolRental, updatePoolTable }
      }
    } catch (error) {
      throw new ConvexError("Failed to update database")
    }
  },
})

export const resetTimer = mutation({
  args: {
    poolTableId: v.id("poolTables"),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await cashierProcedure(ctx)

    const poolRentalByOrderId = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", args.orderId))
      .unique()

    if (!poolRentalByOrderId) {
      throw new ConvexError("Pool rental not found")
    }

    const updatePoolTable = await ctx.db.patch(args.poolTableId, {
      startTime: null,
      endTime: null,
      isActive: false,
    })

    const statusPayment = "PENDING"

    const updateOrder = await ctx.db.patch(args.orderId, {
      statusPayment,
    })

    const updatePoolRental = await ctx.db.patch(poolRentalByOrderId._id, {
      statusPayment,
    })

    return { updatePoolTable, updateOrder, updatePoolRental }
  },
})

export const updatedDuration = zMutation({
  args: { updateDurationSchema },
  handler: async (
    ctx,
    {
      updateDurationSchema: {
        poolTableId,
        poolRentalId,
        updatedDuration,
        packetCost,
      },
    },
  ) => {
    await protectedProcedure(ctx)

    const firstBooking = await ctx.db
      .query("poolRentals")
      .withIndex("by_pooltable_isbooking", (q) =>
        q.eq("poolTableId", poolTableId).eq("isBooking", true),
      )
      .order("desc")
      .first()

    const poolTable = await ctx.db.get(poolTableId)

    // Endsure poolTable exists
    if (!poolTable?.startTime || !poolTable.gapDuration) {
      throw new ConvexError("Pool table not found or missing required fields.")
    }
    // (previous-code): newEndTime.setHours(newEndTime.getHours() + updatedDuration)
    // convert gapDuration to time_in_milliseconds
    const updatedDurationInMilliseconds = updatedDuration * 60 * 60 * 1000 // hour -> milliseconds (3_600_000)
    const newEndTime = poolTable.startTime + updatedDurationInMilliseconds

    // If there's no firstBooking, we can skip the overlap check
    if (firstBooking?.timeStart) {
      const gapDurationInMilliseconds = poolTable.gapDuration * 60 * 1000
      const bufferedStartTime =
        firstBooking.timeStart - gapDurationInMilliseconds

      // If newEndTime is greater than bufferedStartTime, throw an overlap error
      if (newEndTime > bufferedStartTime) {
        throw new ConvexError(
          "The selected time overlaps with another booking.",
        )
      }
    }
    const updateTotalCost =
      Math.round((packetCost * updatedDuration) / 100) * 100

    // Proceed to update the rental and pool table
    const updatePoolRental = await ctx.db.patch(poolRentalId, {
      duration: updatedDuration,
      timeEnd: newEndTime,
      totalCost: updateTotalCost,
    })

    const updatePoolTable = await ctx.db.patch(poolTableId, {
      endTime: newEndTime,
    })

    return { updatePoolRental, updatePoolTable }
  },
})

export const payment = zMutation({
  args: { submitPaymentSchema },
  handler: async (
    ctx,
    {
      submitPaymentSchema: {
        orderId,
        discount,
        tax,
        totalAmount,
        revenue,
        paymentMethod,
        note,
      },
      // ...fields
    },
  ) => {
    // await cashierProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (!["ZENITH", "ADMIN", "CASHIER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    const order = await ctx.db.get(orderId)
    if (!order) throw new ConvexError("Order not found!")

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .unique()

    const statusPayment = "PAID"

    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .collect()

    // Update the status payment of all orderlines by orderId to "PAID"

    const updateOrderlinesRaw = await Promise.all(
      orderlines.map(
        async (orderline) =>
          await ctx.db.patch(orderline._id, { statusPayment }),
      ),
    )

    const updateOrderlines = updateOrderlinesRaw.filter(
      (result) => result !== undefined,
    )

    // No need to update the pool table if the order status payment is "PENDING"
    if (order.statusPayment === "PENDING") {
      const updateOrder = await ctx.db.patch(order._id, {
        totalAmount,
        revenue,
        paymentMethod,
        statusPayment,
        discount,
        tax,
        note,
        updatedBy: user?._id,
        updatedTime: Date.now(),
      })

      return { updateOrder, updateOrderlines }
    }

    const updateOrder = await ctx.db.patch(order._id, {
      totalAmount,
      revenue,
      paymentMethod,
      statusPayment,
      discount,
      tax,
      note,
      updatedBy: user?._id,
      updatedTime: Date.now(),
    })

    // for cafe-only use case
    if (!poolRental) {
      return { updateOrder, updateOrderlines }
    }

    const updatePoolRental = await ctx.db.patch(poolRental._id, {
      statusPayment,
    })

    if (order.statusPayment === "OPEN") {
      const updatePoolTable = await ctx.db.patch(poolRental.poolTableId, {
        startTime: null,
        endTime: null,
      })
      return {
        updateOrder,
        updatePoolRental,
        updateOrderlines,
        updatePoolTable,
      }
    }

    return { updateOrder, updatePoolRental, updateOrderlines }
  },
})

export const updateStatusPaymentTo = mutation({
  args: {
    orderId: v.id("orders"),
    updateTo: v.union(
      v.literal("OPEN"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("CANCELLED"),
      v.literal("REFUND"),
      v.literal("ARCHIVE"),
    ),
  },
  handler: async (ctx, { orderId, updateTo }) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!["ZENITH", "ADMIN", "MANAGER", "CASHIER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    const statusPayment = updateTo // statusPayment must be the same

    // === PoolRentals ===
    const poolRentals = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", orderId))
      .collect()
    if (poolRentals.length === 0) return
    const poolRentalIds = poolRentals.map((rental) => rental._id) // just ids to optimizing

    let updatePoolRentals = []
    for (const rentalId of poolRentalIds) {
      const updateRental = await ctx.db.patch(rentalId, { statusPayment })
      updatePoolRentals.push(updateRental)
    }

    // === Orderlines ===
    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", orderId))
      .collect()
    if (orderlines.length === 0) return
    const orderlineIds = orderlines.map((orderline) => orderline._id) // just ids to optimizing

    let updateOrderlines = []
    for (const orderlineId of orderlineIds) {
      const updateOrderline = await ctx.db.patch(orderlineId, {
        statusPayment,
      })
      updateOrderlines.push(updateOrderline)
    }

    const updateOrder = await ctx.db.patch(orderId, {
      statusPayment,
    })

    return { updateOrder, updatePoolRentals, updateOrderlines }
  },
})

export const updateSelectedOrders = mutation({
  args: {
    selectedOrders: v.array(v.object({ id: v.id("orders") })),
    updateTo: v.union(
      v.literal("OPEN"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("CANCELLED"),
      v.literal("ARCHIVE"),
    ),
  },
  handler: async (ctx, { selectedOrders, updateTo }) => {
    await managerProcedure(ctx)

    const updateAll = await Promise.all(
      selectedOrders.map(async (o) => {
        const order = await ctx.db.get(o.id)
        if (!order) throw new ConvexError("Order not found!")

        const updatePoolRentals = []
        const poolRentals = await ctx.db
          .query("poolRentals")
          .withIndex("orderId", (q) => q.eq("orderId", o.id))
          .collect()

        if (poolRentals.length === 0) return
        const poolRentalIds = poolRentals.map((rental) => rental._id) // just ids to optimizing

        for (const rentalId of poolRentalIds) {
          const update = await ctx.db.patch(rentalId, {
            statusPayment: updateTo,
          })
          updatePoolRentals.push(update)
        }

        const updateOrderlines = []
        const orderlines = await ctx.db
          .query("orderlines")
          .withIndex("orderId", (q) => q.eq("orderId", o.id))
          .collect()

        if (orderlines.length === 0) return
        const orderlineIds = orderlines.map((orderline) => orderline._id) // just ids to optimizing

        for (const orderlineId of orderlineIds) {
          const update = await ctx.db.patch(orderlineId, {
            statusPayment: updateTo,
          })
          updateOrderlines.push(update)
        }

        const updateOrders = await ctx.db.patch(order._id, {
          statusPayment: updateTo,
        })

        return { updateOrders, updatePoolRentals, updateOrderlines }
      }),
    )

    return { ...updateAll }
  },
})

/**
 * Remove the order only for "Cafe-Only-Tab",
 * to remove an order where the customer has not order any menu yet.
 * So, Cashier & Manager can access to remove the order.
 */
export const removeCafeOnly = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    await protectedProcedure(ctx)

    const order = await ctx.db.get(id)

    if (!order?.customerId) throw new ConvexError("No customer ID found!!")
    const removeCustomer = await ctx.db.delete(order.customerId)

    const removeOrder = await ctx.db.delete(id) // sequence after removeCustomer

    return { removeCustomer, removeOrder }
  },
})

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    await managerProcedure(ctx)

    const order = await ctx.db.get(id)
    if (!order) throw new ConvexError("No Order provided!")

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .first()
    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", order._id))
      .collect()

    const deleteCustomer =
      order.customerId != null ? await ctx.db.delete(order.customerId) : null

    const deletePoolRental =
      poolRental != null ? await ctx.db.delete(poolRental._id) : null
    const deleteOrderlines = !!orderlines
      ? await Promise.all(
          orderlines.map(async (ol) => await ctx.db.delete(ol._id)),
        )
      : null

    const deleteOrder = await ctx.db.delete(id)

    return {
      deleteCustomer,
      deletePoolRental,
      ...deleteOrderlines,
      deleteOrder,
    }
  },
})

export const removeSelectedOrders = mutation({
  args: { selectedOrders: v.array(v.object({ id: v.id("orders") })) },
  handler: async (ctx, { selectedOrders }) => {
    await adminProcedure(ctx)

    const removeAll = []
    for (const selectedOrder of selectedOrders) {
      const order = await ctx.db.get(selectedOrder.id)
      if (!order) throw new ConvexError("No Order found!")

      const poolRental = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .first()

      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      const deleteCustomer =
        order.customerId != null ? await ctx.db.delete(order.customerId) : null
      const deletePoolRental =
        poolRental != null ? await ctx.db.delete(poolRental?._id) : null
      const deleteOrderlines =
        orderlines != null
          ? await Promise.all(
              orderlines.map(async (ol) => await ctx.db.delete(ol._id)),
            )
          : null
      const deleteOrder = await ctx.db.delete(order._id)
      removeAll.push({
        deleteCustomer,
        deletePoolRental,
        ...deleteOrderlines,
        deleteOrder,
      })
    }

    return { ...removeAll }
  },
})
