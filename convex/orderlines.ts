import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { upsertOrderlineSchema } from "../types/schema/orderline-schema"
import { mutation, query } from "./_generated/server"
import { cashierProcedure, protectedProcedure, zMutation } from "./helpers"

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

    const orderlines = await ctx.db
      .query("orderlines")
      .filter((q) =>
        q.and(
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()
    return await Promise.all(
      orderlines
        .filter(async (ol) => {
          const order = await ctx.db
            .query("orders")
            .withIndex("by_id", (q) => q.eq("_id", ol.orderId))
            .filter((q) => q.eq(q.field("companyId"), user.companyId))
            .first()
          return ol.orderId === order?._id
        })
        .map(async (ol) => {
          const order = await ctx.db.get(ol.orderId)
          const poolRental =
            order !== null
              ? await ctx.db
                  .query("poolRentals")
                  .withIndex("orderId", (q) => q.eq("orderId", order?._id))
                  .first()
              : null
          const poolTable =
            poolRental !== null
              ? await ctx.db.get(poolRental?.poolTableId)
              : null
          const product = await ctx.db.get(ol.productId)
          const category =
            product !== null ? await ctx.db.get(product?.categoryId) : null
          const unitOfMeasure =
            product !== null ? await ctx.db.get(product?.unitOfMeasureId) : null

          return {
            ...ol,
            order: {
              id: order?._id,
              statusPayment: order?.statusPayment,
              poolRental: { poolTable: { name: poolTable?.name } },
            },
            product: {
              ...product,
              category: { name: category?.name },
              unitOfMeasure: { name: unitOfMeasure?.name },
            },
          }
        }),
    )
  },
})

export const findAllByOrderId = query({
  args: { orderId: v.optional(v.id("orders")) },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const orderlines = await ctx.db
      .query("orderlines")
      .withIndex("orderId", (q) => q.eq("orderId", args.orderId!))
      .collect()

    return Promise.all(
      (orderlines ?? []).map(async (ol) => {
        const product = await ctx.db.get(ol.productId)
        const category =
          product !== null ? await ctx.db.get(product?.categoryId) : null
        const unitOfMeasure =
          product !== null ? await ctx.db.get(product?.unitOfMeasureId) : null

        return { ...ol, product: { ...product, category, unitOfMeasure } }
      }),
    )
  },
})

export const findAllByIds = query({
  args: { ids: v.array(v.id("orderlines")) },
  handler: async (ctx, { ids }) => {
    await protectedProcedure(ctx, {})

    return await Promise.all(
      ids.map(async (id) => {
        const orderline = await ctx.db.get(id)
        const order =
          orderline !== null
            ? await ctx.db
                .query("orders")
                .withIndex("by_id", (q) => q.eq("_id", orderline?.orderId))
                .first()
            : null
        const company =
          order !== null ? await ctx.db.get(order?.companyId) : null
        const product =
          orderline !== null ? await ctx.db.get(orderline?.productId) : null
        const category =
          product !== null ? await ctx.db.get(product?.categoryId) : null

        return {
          ...orderline,
          company: { name: company?.name },
          order,
          product: {
            name: product?.name,
            category: {
              name: category?.name,
            },
          },
        }
      }),
    )
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
        const orderlines = await ctx.db
          .query("orderlines")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect()
        return {
          length: orderlines.length,
          quantity: orderlines.reduce((acc, curr) => acc + curr.quantity, 0),
          amount: orderlines.reduce((acc, curr) => acc + curr.amount, 0),
        }
      }),
    )
    const _count = orderList.reduce((acc, curr) => acc + curr.length, 0)
    const quantity = orderList.reduce(
      (acc, curr) => acc + (curr.quantity ?? 0),
      0,
    )
    const amount = orderList.reduce((acc, curr) => acc + (curr.amount ?? 0), 0)

    return {
      _count,
      _sum: {
        quantity,
        amount,
      },
    }
  },
})
export const _sumByCategory = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    categoryName: v.string(),
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

    // Step 1: Get the category ID for the given category name
    const category = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("name"), args.categoryName))
      .first()

    if (!category) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } } // return default if category not found
    }

    // Step 2: Get all product IDs that belong to the category
    const products = await ctx.db
      .query("products")
      .withIndex("categoryId", (q) => q.eq("categoryId", category._id))
      .filter((q) => q.eq(q.field("companyId"), user.companyId))
      .collect()

    if (products.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } } // Return default if no products in the category
    }

    const productIds = products.map((product) => product._id)

    // Step 3: Get all orders with statusPayment === "PAID"
    const paidOrders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          q.gt(q.field("_creationTime"), args.from ?? 0),
          q.lte(q.field("_creationTime"), args.to ?? Date.now()),
        ),
      )
      .collect()

    if (paidOrders.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } } // Return default if no paid orders
    }

    const orderIds = paidOrders.map((order) => order._id)

    // Step 4: Query matching orderlines for each productId and orderId
    const orderlines = []
    for (const productId of productIds) {
      for (const orderId of orderIds) {
        const lines = await ctx.db
          .query("orderlines")
          .filter((q) =>
            q.and(
              q.eq(q.field("productId"), productId),
              q.eq(q.field("orderId"), orderId),
            ),
          )
          .collect()
        orderlines.push(...lines)
      }
    }

    // Step 5: Aggregate the data
    const aggreggation = orderlines.reduce(
      (acc, line) => {
        acc._count += 1
        acc._sum.quantity += line.quantity
        acc._sum.amount += line.amount
        return acc
      },
      { _count: 0, _sum: { quantity: 0, amount: 0 } },
    )

    return aggreggation
  },
})

export const _calculateProfit = query({
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
          q.gt(q.field("_creationTime"), args.from ?? 0),
          q.lte(q.field("_creationTime"), args.to ?? Date.now()),
        ),
      )
      .order("desc")
      .collect()

    let totalAmount = 0
    let totalCost = 0
    let totalQuantity = 0

    for (const order of orders) {
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      for (const ol of orderlines) {
        const product = await ctx.db.get(ol.productId)

        if (product) {
          const { costPrice = 0 } = product

          totalAmount += ol.amount
          totalCost += ol.quantity * costPrice
          totalQuantity += ol.quantity
        }
      }
    }
    return {
      totalAmount, // Total revenue from all orderlines
      totalCost, // Total cost of products sold
      totalQuantity, // Total products sold
    }
  },
})
// === ENDS DASHBOARD ===

// === MUTATIONS ===

export const updateOrderlineStatusList = mutation({
  args: {
    ids: v.array(v.id("orderlines")),
  },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const updateAll = Promise.all(
      args.ids.map(
        async (id) =>
          await ctx.db.patch(id, {
            orderlineStatus: "ORDERED",
          }),
      ),
    )
    return { ...updateAll }
  },
})

export const upsert = zMutation({
  args: { upsertOrderlineSchema },
  handler: async (
    ctx,
    {
      upsertOrderlineSchema: {
        id,
        orderId,
        orderlineStatus,
        productId,
        quantity,
        amount,
      },
    },
  ) => {
    // cashierProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    if (!!id && orderlineStatus === "UNORDERED") {
      // update new orderline
      return await ctx.db.patch(id, {
        quantity,
        amount,
      })
    }
    // otherwise, create
    return await ctx.db.insert("orderlines", {
      productId,
      quantity,
      amount,
      orderId,
      orderlineStatus: "UNORDERED", // "UNORDERED" is default value
    })
  },
})

export const remove = mutation({
  args: { id: v.id("orderlines") },
  handler: async (ctx, args) => {
    await cashierProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})
