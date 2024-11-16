import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  startTimerSchema,
  stopTimerSchema,
  updateDurationSchema,
} from "../types/schema/order-schema"
import { submitPaymentSchema } from "../types/schema/payment-schema"
import { mutation, query } from "./_generated/server"
import {
  cashierProcedure,
  managerProcedure,
  protectedProcedure,
  zMutation,
} from "./helpers"

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
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) =>
        q.and(
          q.neq(q.field("statusPayment"), args.notEqual),
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
          .filter((q) => q.eq(q.field("isBooking"), false))
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
  args: {
    id: v.id("orders"),
    notEqual: v.union(
      v.literal("OPEN"),
      v.literal("CANCELLED"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("ARCHIVE"),
    ),
  },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const order = await ctx.db
      .query("orders")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .filter((q) => q.neq(q.field("statusPayment"), args.notEqual))
      .first()

    const createdBy = await ctx.db.get(order?.createdBy!)
    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order?._id!))
      .first()
    const poolTable = await ctx.db.get(poolRental?.poolTableId!)
    const packet = await ctx.db.get(poolRental?.packetId!)

    const company = await ctx.db.get(order?.companyId!)

    return {
      ...order,
      createdBy,
      poolRental: {
        ...poolRental,
        poolTable,
        packet,
      },
      company,
    }
  },
})

export const findByPoolTableId = query({
  args: { poolTableId: v.id("poolTables") },
  handler: async (ctx, args) => {
    // await protectedProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("poolTableId", (q) => q.eq("poolTableId", args.poolTableId))
      .filter((q) => q.eq(q.field("isBooking"), false))
      .first()

    const order = await ctx.db
      .query("orders")
      .withIndex("by_id", (q) => q.eq("_id", poolRental?.orderId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), user?.companyId),
          q.eq(q.field("statusPayment"), "OPEN"),
        ),
      )
      .first()

    const packet = await ctx.db.get(poolRental?.packetId!)
    const customer = order !== null ? await ctx.db.get(order?.companyId) : null
    const createdBy =
      order !== null
        ? await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", order?.createdBy))
            .unique()
        : null

    return {
      ...order,
      poolRental,
      packet,
      customer,
      createdBy,
    }
  },
})

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
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    if (!user.companyId) throw new ConvexError("No company provided!")

    const HOUR_TO_MILLISECOND = 60 * 60 * 1000
    const startTime = Date.now()
    const endTime = startTime + duration * HOUR_TO_MILLISECOND

    const updatePoolTable = await ctx.db.patch(poolTableId, {
      isActive: true,
      startTime,
      endTime: rate === "HOUR" ? endTime : undefined,
    })

    const totalCost = Math.round((cost * duration) / 100) * 100

    const customerId = await ctx.db.insert("customers", {
      name: customerName ?? "anonymous",
      phone: customerPhone,
      companyId: user.companyId,
    })

    const orderId = await ctx.db.insert("orders", {
      createdBy: user._id,
      companyId: user.companyId,
      statusPayment: "OPEN",
      customerId,
    })

    const createOrder = await ctx.db.insert("poolRentals", {
      orderId,
      poolTableId: poolTableId,
      packetId: packetId,
      duration: duration,
      totalCost,
      timeStart: startTime,
      timeEnd: rate === "HOUR" ? endTime : undefined,
      isBooking: false,
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
    const updatePoolTable = await ctx.db.patch(poolTableId, {
      isActive: false,
      endTime,
    })

    //? Calculate duration in minute-rate
    const ONE_HOUR_IN_MILLISECONDS = 1_000 * 60 * 30

    const elapsedTime = endTime - startTime
    const elapsedInMinutes = Math.floor(elapsedTime / (1000 * 60))
    const oneHourInMinutes = Math.floor(ONE_HOUR_IN_MILLISECONDS / (1000 * 60))

    //? Calculate totalCost in minute-rate and Math.round() it
    let totalCostInMinutes: number

    //? If duration is less than one hour, than cust must pay as 1hr totalCost
    if (elapsedTime < ONE_HOUR_IN_MILLISECONDS) {
      totalCostInMinutes = cost * oneHourInMinutes
    } else {
      totalCostInMinutes = cost * elapsedInMinutes
    }

    const totalCost = Math.round(totalCostInMinutes / 100) * 100

    //? For MINUTE rate only

    let updatePoolRental

    if (rate === "MINUTE") {
      updatePoolRental = await ctx.db.patch(poolRentalId, {
        duration: elapsedInMinutes,
        totalCost,
        timeEnd: endTime,
      })
    } else {
      updatePoolRental = await ctx.db.patch(poolRentalId, {
        timeEnd: endTime,
      })
    }
    return { updatePoolTable, updatePoolRental }
  },
})

export const resetTimer = mutation({
  args: {
    poolTableId: v.id("poolTables"),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    await cashierProcedure(ctx, {})

    const updatePoolTable = await ctx.db.patch(args.poolTableId, {
      startTime: undefined,
      endTime: undefined,
      isActive: false,
    })

    const updateOrder = await ctx.db.patch(args.orderId, {
      statusPayment: "PENDING",
    })

    return { updatePoolTable, updateOrder }
  },
})

export const updatedDuration = zMutation({
  args: { updateDurationSchema },
  handler: async (
    ctx,
    { updateDurationSchema: { poolTableId, poolRentalId, updatedDuration } },
  ) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    const order = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) => q.and(q.eq(q.field("statusPayment"), "OPEN")))
      .first()

    const firstBooking = await ctx.db
      .query("poolRentals")
      .withIndex("orderId", (q) => q.eq("orderId", order?._id!))
      .filter((q) =>
        q.and(
          q.eq(q.field("poolTableId"), poolTableId),
          q.eq(q.field("isBooking"), true),
        ),
      )
      .order("asc")
      .first()

    const poolTable = await ctx.db.get(poolTableId)

    // Endsure poolTable exists
    if (!poolTable?.startTime || !poolTable.gapDuration) {
      throw new ConvexError("Pool table not found or missing required fields.")
    }
    // (previous-code): newEndTime.setHours(newEndTime.getHours() + updatedDuration)
    // convert gapDuration to time_in_milliseconds
    const updatedDurationInMilliseconds = updatedDuration * 60 * 1000
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

    // Proceed to update the rental and pool table
    const updatePoolRental = await ctx.db.patch(poolRentalId, {
      duration: updatedDuration,
      timeEnd: newEndTime,
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
    },
  ) => {
    const updateOrder = await ctx.db.patch(orderId, {
      totalAmount,
      revenue,
      paymentMethod,
      statusPayment: "PAID",
      discount,
      tax,
      note,
    })

    const poolRental = await ctx.db
      .query("poolRentals")
      .withIndex("orderId")
      .first()
    const poolTable = await ctx.db.get(poolRental?.poolTableId!)

    const updatePoolTable = await ctx.db.patch(poolTable?._id!, {
      startTime: undefined,
      endTime: undefined,
    })

    return { updateOrder, updatePoolTable }
  },
})

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    await managerProcedure(ctx, {})

    return await ctx.db.delete(id)
  },
})
