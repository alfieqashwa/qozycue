import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import { upsertOrderlineSchema } from "../types/schema/orderline-schema"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import {
  BATCH_SIZE,
  managerProcedure,
  protectedProcedure,
  zMutation,
} from "./helpers"

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
      .withIndex("companyId", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    // Get all paid orderlines within date range
    const paidOrderlines = await ctx.db
      .query("orderlines")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .order("desc")
      .collect()

    if (paidOrderlines.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    return paidOrderlines.reduce(
      (acc, lines) => {
        acc._count += 1
        acc._sum.quantity += lines.quantity
        acc._sum.amount += lines.amount
        return acc
      },
      {
        _count: 0,
        _sum: { quantity: 0, amount: 0 },
      },
    )
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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) return null

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
      .withIndex("by_category_company", (q) =>
        q.eq("categoryId", category._id).eq("companyId", user.companyId!),
      )
      .collect()

    if (products.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    const productIds = new Set(products.map((product) => product._id))

    // Step 3: Get all paid orderlines within the date range
    const paidOrderlines = await ctx.db
      .query("orderlines")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .collect()

    if (paidOrderlines.length === 0) {
      return { _count: 0, _sum: { quantity: 0, amount: 0 } }
    }

    return paidOrderlines
      .filter((line) => line.productId && productIds.has(line.productId))
      .reduce(
        (acc, line) => {
          acc._count += 1
          acc._sum.quantity += line.quantity ?? 0
          acc._sum.amount += line.amount ?? 0
          return acc
        },
        { _count: 0, _sum: { quantity: 0, amount: 0 } },
      )
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
      !user?.companyId ||
      !["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? "")
    )
      throw new ConvexError("You do not have access!")

    // Get all paid orderlines matching criteria
    const paidOrderlines = await ctx.db
      .query("orderlines")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .collect()

    if (paidOrderlines.length === 0) {
      return {
        totalAmount: 0, // Total revenue from all orderlines
        totalCost: 0, // Total cost of products sold
        totalQuantity: 0, // Total products sold
      }
    }

    // Extract unique product Ids and fetch related product data
    const productIds = [...new Set(paidOrderlines.map((ol) => ol.productId))]
    const products = await Promise.all(productIds.map((id) => ctx.db.get(id)))
    // Step 3: Create a lookup map from productId to costPrice
    const productCostMap = new Map(
      products
        .filter((product) => !!product)
        .map((product) => [product?._id, product?.costPrice ?? 0]),
    )

    // Step 4: Aggregate profit metrics
    const result = paidOrderlines.reduce(
      (acc, ol) => {
        const costPrice = productCostMap.get(ol.productId) ?? 0
        acc.totalAmount += ol.amount ?? 0
        acc.totalCost += (ol.quantity ?? 0) * costPrice
        acc.totalQuantity += ol.quantity ?? 0
        return acc
      },
      { totalAmount: 0, totalCost: 0, totalQuantity: 0 },
    )
    return result
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
      !user?.companyId ||
      !["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? "")
    )
      throw new ConvexError("You do not have access!")

    // Step 1: Fetch all paid orderlines for the user's company
    const paidOrderlines = await ctx.db
      .query("orderlines")
      .withIndex("by_company_statuspayment", (q) =>
        q
          .eq("companyId", user?.companyId!)
          .eq("statusPayment", "PAID")
          .gte("_creationTime", args.from ?? 0)
          .lte("_creationTime", args.to ?? Number.MAX_SAFE_INTEGER),
      )
      .collect()

    if (paidOrderlines.length === 0) return []

    // Step 3: Group by productId and aggregate
    const groupedData = paidOrderlines.reduce(
      (acc, line) => {
        const productId = line.productId
        if (!acc[productId]) {
          acc[productId] = {
            productId: line.productId,
            _sum: { amount: 0, quantity: 0 },
          }
        }

        acc[productId]._sum.amount += line.amount ?? 0
        acc[productId]._sum.quantity += line.quantity ?? 0

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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    if (!user?.companyId) throw new ConvexError("No company provided!")

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
      statusPayment: "OPEN",
      orderId,
      orderlineStatus: "UNORDERED", // "UNORDERED" is default value
      companyId: user?.companyId,
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
    if (!["ZENITH", "ADMIN", "OWNER"].includes(user?.role ?? ""))
      throw new ConvexError("You do not have access!")

    const company = await ctx.db.get(user?.companyId as Id<"companies">)
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
