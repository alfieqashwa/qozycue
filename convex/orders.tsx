import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import {
  cashierProcedure,
  protectedProcedure,
  zMutation,
  zQuery,
} from "./helpers"
import { getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"
import { startTimerSchema, stopTimerSchema } from "../types/schema/order-schema"

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

    const order = await ctx.db
      .query("orders")
      .withIndex("by_id", (q) => q.eq("_id", poolRental?.orderId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "OPEN"),
          q.eq(q.field("isBooking"), false),
        ),
      )
      .first()

    const packet = await ctx.db.get(poolRental?.packetId!)

    return { ...order, poolRental, packet }
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
      isBooking: false,
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

const resetTimer = mutation({
  args: {
    poolTableId: v.id("poolTables"),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
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

/**
alfieqshwa: k575ywf2h48g4r326pcyq7aa3n73mf53
cozycue: jx77ycz3zzpkez925c3ef5gnvn740tj4
custID: kn77s1hjhe02gt1nxp6j9dkgcn74fbdx
orderID: m575rk0t8a6hzwcekzj5z65avd74fcjn
poolTablID (1): k97cg2bh19423r51hewqgay98h73n6p1
packetID: (minute_regular): kh79by5vzkyyj0re47hm13bcvn74fn17

 */
