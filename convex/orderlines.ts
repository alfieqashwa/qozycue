import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { upsertOrderlineSchema } from "../types/schema/orderline-schema"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { managerProcedure, protectedProcedure, zMutation } from "./helpers"

export const findAllSortedByDate = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user) throw new ConvexError("You do not have access!")

    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) =>
        q.and(
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    if (orders.length === 0) return []

    const filteredOrderlines = []

    for (const order of orders) {
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()

      const poolRental =
        order !== null
          ? await ctx.db
              .query("poolRentals")
              .withIndex("orderId", (q) => q.eq("orderId", order?._id))
              .first()
          : null
      const poolTable =
        poolRental !== null ? await ctx.db.get(poolRental?.poolTableId) : null
      for (const orderline of orderlines) {
        const product = await ctx.db.get(orderline.productId)
        const category =
          product !== null ? await ctx.db.get(product?.categoryId) : null
        const unitOfMeasure =
          product !== null ? await ctx.db.get(product?.unitOfMeasureId) : null

        filteredOrderlines.push({
          ...orderline,
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
        })
      }
    }
    return filteredOrderlines
  },
})

export const findAllByOrderId = query({
  args: { orderId: v.optional(v.id("orders")) },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

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
  args: { ids: v.optional(v.array(v.id("orderlines"))) },
  handler: async (ctx, { ids }) => {
    await protectedProcedure(ctx)

    if (!ids) return []

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

export const findByProductId = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    await protectedProcedure(ctx)

    if (!productId) return null

    return await ctx.db
      .query("orderlines")
      .withIndex("productId", (q) => q.eq("productId", productId))
      .first()
  },
})

// === STARTS DASHBOARD ===
export const _sumRevenue = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    //  Auth check: ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    // Get all paid orders within date range
    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          args.from ? q.gt(q.field("_creationTime"), args.from) : true,
          args.to ? q.lte(q.field("_creationTime"), args.to) : true,
        ),
      )
      .order("desc")
      .collect()

    if (orders.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    // Process orders in batches
    const BATCH_SIZE = 50
    let totalCount = 0
    let totalQuantity = 0
    let totalAmount = 0

    for (let i = 0; i < orders.length; i += BATCH_SIZE) {
      const batchOrders = orders.slice(i, i + BATCH_SIZE)

      // Process this batch
      const batchResults = await Promise.all(
        batchOrders.map(async (order) => {
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

      // Add batch results to totals
      for (const result of batchResults) {
        totalCount += result.length
        totalQuantity += result.quantity || 0
        totalAmount += result.amount || 0
      }
    }

    return {
      _count: totalCount,
      _sum: {
        quantity: totalQuantity,
        amount: totalAmount,
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
    // Auth check: ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    // Step 1: Get the category ID
    const category = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.categoryName))
      .first()

    if (!category) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    // Step 2: Get all product IDs in the category for this company
    const products = await ctx.db
      .query("products")
      .withIndex("categoryId", (q) => q.eq("categoryId", category._id))
      .filter((q) => q.eq(q.field("companyId"), user.companyId))
      .collect()

    if (products.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }
    const productIds = products.map((product) => product._id)

    // Step 3: Get all paid orders within the date range
    const paidOrders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          args.from ? q.gte(q.field("_creationTime"), args.from) : true,
          args.to ? q.lte(q.field("_creationTime"), args.to) : true,
        ),
      )
      .collect()

    if (paidOrders.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }
    const orderIds = paidOrders.map((order) => order._id)

    // Step 4: More efficient approach - query by product IDs first, then filter by order IDs
    const aggregation = { _count: 0, _sum: { quantity: 0, amount: 0 } }

    // Process in batches to avoid hitting query limits
    const BATCH_SIZE = 50
    for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
      const batchProductIds = productIds.slice(i, i + BATCH_SIZE)

      for (const productId of batchProductIds) {
        const orderlines = await ctx.db
          .query("orderlines")
          .withIndex("productId", (q) => q.eq("productId", productId))
          .collect()

        const filteredOrderlines = orderlines.filter((line) =>
          orderIds.includes(line.orderId),
        )

        for (const orderline of filteredOrderlines) {
          aggregation._count += 1
          aggregation._sum.quantity += orderline.quantity
          aggregation._sum.amount += orderline.amount
        }
      }
    }

    return aggregation
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
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    // Get all orders matching criteria
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q.eq("companyId", user.companyId!).eq("statusPayment", "PAID"),
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("statusPayment"), "PAID"),
          args.from ? q.gte(q.field("_creationTime"), args.from) : true,
          args.to ? q.lte(q.field("_creationTime"), args.to) : true,
        ),
      )
      .collect()

    // Extract order IDs
    const orderIds = orders.map((order) => order._id)

    // Fetch all orderlines for these orders
    const allOrderlines = await ctx.db.query("orderlines").collect()

    // Filter orderlines for our orders
    const orderlines = allOrderlines.filter((ol) =>
      orderIds.includes(ol.orderId),
    )

    // Extract unique product Ids
    const productIds = [...new Set(orderlines.map((ol) => ol.productId))]

    const products = await Promise.all(productIds.map((id) => ctx.db.get(id)))

    // Initial totals
    let totalAmount = 0
    let totalCost = 0
    let totalQuantity = 0

    // Process products in batches
    const BATCH_SIZE = 50
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batchProductIds = productIds.slice(i, i + BATCH_SIZE)

      // Fetch products in batch
      const products = await Promise.all(
        batchProductIds.map((id) => ctx.db.get(id)),
      )

      // Create a map for quick product lookup
      const productsMap = new Map()
      products.forEach((product) => {
        if (product) productsMap.set(product._id, product)
      })

      // Process orderlines for this batch of products
      for (const productId of batchProductIds) {
        const product = productsMap.get(productId)
        if (!product) continue

        // Find all orderlines for this product
        const productOrderlines = orderlines.filter(
          (ol) => ol.productId === productId,
        )

        // Calculate totals for this product
        for (const ol of productOrderlines) {
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

export const _groupByProductId = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // ownerProcedure()
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "OWNER"
    )
      throw new ConvexError("You do not have access!")

    // Step 1: Fetch all paid orders for the user's company
    const paidOrders = await ctx.db
      .query("orders")
      .withIndex("by_company_statuspayment", (q) =>
        q.eq("companyId", user.companyId!).eq("statusPayment", "PAID"),
      )
      .filter((q) =>
        q.and(
          args.from ? q.gt(q.field("_creationTime"), args.from) : true,
          args.to ? q.lte(q.field("_creationTime"), args.to) : true,
        ),
      )
      .collect()

    if (paidOrders.length === 0) return []

    const orderIds = paidOrders.map((order) => order._id)

    // Step 2: Fetch all orderlines in batches
    const BATCH_SIZE = 50

    // Define the type for orderlines based on your schema
    type Orderline = {
      _id: Id<"orderlines">
      orderId: Id<"orders">
      productId: Id<"products">
      quantity: number
      amount: number
      // Add any other fields your orderlines have
    }
    let allOrderlines: Orderline[] = []

    for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
      const batchOrderIds = orderIds.slice(i, i + BATCH_SIZE)

      // Process each batch of orders
      const batchOrderlines = await Promise.all(
        batchOrderIds.map(async (orderId) => {
          const orderlines = await ctx.db
            .query("orderlines")
            .withIndex("orderId", (q) => q.eq("orderId", orderId))
            .collect()

          return orderlines
        }),
      )

      // Fetch all orderlines for this batch in parallel
      allOrderlines = [...allOrderlines, ...batchOrderlines.flat()]
    }

    if (allOrderlines.length === 0) return []

    // Step 3: Group by productId and aggregate (this is already efficient)
    const groupedData = allOrderlines.reduce(
      (acc, line) => {
        const productId = line.productId.toString()

        if (!acc[productId]) {
          acc[productId] = {
            productId: line.productId,
            _sum: { amount: 0, quantity: 0 },
          }
        }

        acc[productId]._sum.amount += line.amount || 0
        acc[productId]._sum.quantity += line.quantity || 0

        return acc
      },
      {} as Record<
        string,
        { productId: string; _sum: { amount: number; quantity: number } }
      >,
    )

    // Convert grouped data into an array
    return Object.values(groupedData)
  },
})
// === ENDS DASHBOARD ===

// === MUTATIONS ===

export const updateOrderlineStatusList = mutation({
  args: {
    ids: v.array(v.id("orderlines")),
  },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx)

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

export const toggleIsFree = mutation({
  args: { orderlineId: v.id("orderlines"), isFree: v.boolean() },
  handler: async (ctx, { orderlineId, isFree }) => {
    await managerProcedure(ctx)

    return ctx.db.patch(orderlineId, {
      isFree,
    })
  },
})

export const upsert = zMutation({
  args: { upsertOrderlineSchema },
  handler: async (
    ctx,
    {
      upsertOrderlineSchema: {
        id,
        orderlineStatus,
        quantity,
        amount,
        productId,
        countInStock,
        orderId,
      },
    },
  ) => {
    // cashierProcedure(ctx, {})
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    const updateStock = await ctx.db.patch(productId, {
      countInStock,
    })

    if (!!id && orderlineStatus === "UNORDERED") {
      // update new orderline
      const updateOrderline = await ctx.db.patch(id, {
        quantity,
        amount,
      })

      return {
        updateStock,
        updateOrderline,
      }
    }

    // otherwise, create
    const createOrderline = await ctx.db.insert("orderlines", {
      productId,
      quantity,
      amount,
      isFree: false,
      orderId,
      orderlineStatus: "UNORDERED", // "UNORDERED" is default value
    })

    return {
      updateStock,
      createOrderline,
    }
  },
})

export const remove = mutation({
  args: {
    id: v.id("orderlines"),
    productId: v.id("products"),
    countInStock: v.number(),
  },
  handler: async (ctx, args) => {
    // cashierProcedure(ctx)
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")

    const company = await ctx.db.get(user.companyId as Id<"companies">)
    if (!company) {
      throw new ConvexError("Company not found!")
    }

    const removeOrderline = await ctx.db.delete(args.id)

    let updateStock = null
    if (company.isStockable) {
      updateStock = await ctx.db.patch(args.productId, {
        countInStock: args.countInStock,
      })
    }

    return {
      removeOrderline,
      ...(updateStock ? { updateStock } : {}),
    }
  },
})
