import { authTables, getAuthUserId } from "@convex-dev/auth/server"
import { NoOp } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery, zid } from "convex-helpers/server/zod"
import { ConvexError, v } from "convex/values"
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server"
import { Id } from "./_generated/dataModel"

export const zQuery = zCustomQuery(query, NoOp)
export const zMutation = zCustomMutation(mutation, NoOp)
export const zInternalQuery = zCustomQuery(internalQuery, NoOp)

export const superAdminProcedure = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (user?.email !== process.env.DEWA_EMAIL)
      throw new ConvexError("You do not have access!")
    return
  },
})

export const adminProcedure = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (user?.role !== "DEWA" && user?.role !== "ADMIN")
      throw new ConvexError("You do not have access!")
    return
  },
})

export const managerProcedure = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "MANAGER"
    )
      throw new ConvexError("You do not have access!")
    return
  },
})

export const cashierProcedure = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    if (
      user?.role !== "DEWA" &&
      user?.role !== "ADMIN" &&
      user?.role !== "CASHIER"
    )
      throw new ConvexError("You do not have access!")
    return
  },
})

export const protectedProcedure = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) throw new ConvexError("Please signed in!")
    return
  },
})

// Deletes all auth-related data.
// Just for demoing purposes, feel free to delete.
export const reset = internalMutation({
  args: { forReal: v.string() },
  handler: async (ctx, args) => {
    if (args.forReal !== "reset-batman") {
      throw new ConvexError(
        "You must know what you're doing to reset the database.",
      )
    }
    for (const table of Object.keys(authTables)) {
      for (const { _id } of await ctx.db.query(table as any).collect()) {
        await ctx.db.delete(_id)
      }
    }
  },
})

//? === STARTS CREATE_TRIAL_MUTATION ===
export const createTrialCompany = internalMutation({
  args: { userId: v.id("users"), companyId: v.id("companies") },
  handler: async (ctx, { userId, companyId }) => {
    const updateUserRole = await ctx.db.patch(userId, {
      role: "ADMIN",
      companyId,
    })

    type TPoolTable = {
      companyId: Id<"companies">
      name: string
      description: string
      isActive: boolean
      gapDuration: number
      status: "enabled" | "disabled"
      startTime: number | null
      endTime: number | null
    }
    const poolTableList: TPoolTable[] = Array.from({ length: 10 }, (_, i) => ({
      companyId,
      name: `${i + 1}`,
      description: `table-${i + 1}`,
      isActive: false,
      gapDuration: 10,
      status: "enabled",
      startTime: null,
      endTime: null,
    }))
    const insertedPoolTableIds: Id<"poolTables">[] = [] // array to store the inserted IDs
    await Promise.all(
      poolTableList.map(async (poolTable) => {
        const result = await ctx.db.insert("poolTables", poolTable)
        insertedPoolTableIds.push(result)
      }),
    )

    type TDiscAndTax = {
      name: string
      value: number
      isDefaultValue: boolean
      companyId: Id<"companies">
    }

    const sampleDiscountList: TDiscAndTax[] = [
      { name: "0%", value: 0.0, isDefaultValue: false, companyId },
      { name: "5%", value: 0.05, isDefaultValue: false, companyId },
      { name: "10%", value: 0.1, isDefaultValue: false, companyId },
      { name: "15%", value: 0.15, isDefaultValue: false, companyId },
      { name: "20%", value: 0.2, isDefaultValue: false, companyId },
    ]
    const insertedDiscountIds: Id<"discounts">[] = []
    await Promise.all(
      sampleDiscountList.map(async (discount) => {
        const result = await ctx.db.insert("discounts", discount)
        insertedDiscountIds.push(result)
      }),
    )

    const sampleTaxList: TDiscAndTax[] = [
      { name: "0%", value: 0.0, isDefaultValue: false, companyId },
      { name: "6%", value: 0.06, isDefaultValue: false, companyId },
      { name: "11%", value: 0.11, isDefaultValue: true, companyId },
      { name: "21%", value: 0.21, isDefaultValue: false, companyId },
    ]
    const insertedTaxIds: Id<"taxes">[] = []
    await Promise.all(
      sampleTaxList.map(async (tax) => {
        const result = await ctx.db.insert("taxes", tax)
        insertedTaxIds.push(result)
      }),
    )

    type TPacket = {
      description?: string | undefined
      name: string
      companyId: Id<"companies">
      status: "disabled" | "enabled"
      cost: number
      rate: "MINUTE" | "HOUR"
    }
    const samplePacketList: TPacket[] = [
      {
        name: "reguler",
        rate: "MINUTE",
        cost: 666.67,
        description: "packet rate in minute",
        status: "enabled",
        companyId,
      },
      {
        name: "free",
        rate: "MINUTE",
        cost: 1,
        description: "packet rate in minute",
        status: "disabled",
        companyId,
      },
      {
        name: "reguler",
        rate: "HOUR",
        cost: 40000,
        description: "paket rate hourly",
        status: "enabled",
        companyId,
      },
      {
        name: "promo",
        rate: "HOUR",
        cost: 35000,
        description: "paket rate hourly",
        status: "enabled",
        companyId,
      },
      {
        name: "student",
        rate: "HOUR",
        cost: 30000,
        description: "paket rate hourly",
        status: "enabled",
        companyId,
      },
      {
        name: "free",
        rate: "HOUR",
        cost: 1,
        description: "paket rate hourly",
        status: "disabled",
        companyId,
      },
    ]
    const insertedPacketIds: Id<"packets">[] = []
    await Promise.all(
      samplePacketList.map(async (packet) => {
        const result = await ctx.db.insert("packets", packet)
        insertedPacketIds.push(result)
      }),
    )

    const foodCategory = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", "food"))
      .first()
    const drinkCategory = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", "drink"))
      .first()
    const othersCategory = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", "others"))
      .first()
    const itemUom = await ctx.db
      .query("unitOfMeasures")
      .withIndex("by_name", (q) => q.eq("name", "item"))
      .first()

    if (!foodCategory?._id && !drinkCategory?._id && !othersCategory?._id)
      throw new ConvexError("No Category ID provided!")
    const foodCategoryId = foodCategory?._id as Id<"categories">
    const drinkCategoryId = drinkCategory?._id as Id<"categories">
    const othersCategoryId = othersCategory?._id as Id<"categories">

    if (!itemUom?._id) throw new ConvexError("No UoM ID provided!")
    const itemUomId = itemUom._id as Id<"unitOfMeasures">

    type TProduct = {
      countInStock?: number | undefined
      name: string
      companyId: Id<"companies">
      status: "disabled" | "enabled"
      costPrice: number
      salePrice: number
      unitOfMeasureId: Id<"unitOfMeasures">
      categoryId: Id<"categories">
    }
    const sampleTrialProductList: TProduct[] = [
      {
        name: "mineral water",
        costPrice: 25000,
        salePrice: 30000,
        status: "enabled",
        categoryId: drinkCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
      {
        name: "cappuccino hot",
        costPrice: 25000,
        salePrice: 30000,
        status: "enabled",
        categoryId: drinkCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
      {
        name: "nasi goreng kornet",
        costPrice: 30000,
        salePrice: 35000,
        status: "enabled",
        categoryId: foodCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
      {
        name: "chicken wings",
        costPrice: 30000,
        salePrice: 35000,
        status: "enabled",
        categoryId: foodCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
      {
        name: "a mild merah",
        costPrice: 45000,
        salePrice: 55000,
        status: "enabled",
        categoryId: othersCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
      {
        name: "marlboro putih",
        costPrice: 45000,
        salePrice: 55000,
        status: "enabled",
        categoryId: othersCategoryId,
        unitOfMeasureId: itemUomId,
        companyId,
      },
    ]
    const insertedProductIds: Id<"products">[] = []
    await Promise.all(
      sampleTrialProductList.map(async (product) => {
        const result = await ctx.db.insert("products", product)
        insertedProductIds.push(result)
      }),
    )
    return {
      companyId,
      updateUserRole,
      insertedPoolTableIds,
      insertedDiscountIds,
      insertedTaxIds,
      insertedPacketIds,
      insertedProductIds,
    }
  },
})
//? === ENDS CREATE_TRIAL_MUTATION ===

//? this API will be used to validate the client based on its subscriptions.
export const subscriptions = zInternalQuery({
  args: { companyId: zid("companies").optional() },
  handler: async (ctx, { companyId }) => {
    if (!companyId) throw new ConvexError("No company provided!")
    const company = await ctx.db.get(companyId)

    const users = await ctx.db
      .query("users")
      .withIndex("companyId", (q) => q.eq("companyId", companyId))
      .collect()
    const poolTables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", companyId))
      .collect()
    const products = await ctx.db
      .query("products")
      .withIndex("companyId", (q) => q.eq("companyId", companyId))
      .collect()
    const packets = await ctx.db
      .query("packets")
      .withIndex("companyId", (q) => q.eq("companyId", companyId))
      .collect()

    const excludeSuperAdmin = users.filter((q) => q.role !== "DEWA")
    const _count = {
      users: excludeSuperAdmin.length,
      poolTables: poolTables.length,
      products: products.length,
      packets: packets.length,
    }

    return { subscription: company?.subscription, _count }
  },
})

type Subscription = "TRIAL" | "BASIC" | "PRO" | "ENTERPRISE"
interface ValidationParams {
  subscription: Subscription
  poolTableLen?: number
  productLen?: number
  packetLen?: number
  userLen?: number
}

//? Source -> https://chatgpt.com/c/66ebf326-a3a4-8002-ba16-560775196c62
export function validateSubscriptionLimits({
  subscription,
  poolTableLen,
  productLen,
  packetLen,
  userLen,
}: ValidationParams): boolean {
  // Max limits for different subscription levels
  const limits = {
    poolTable: { TRIAL: 10, BASIC: 20, PRO: 40, ENTERPRISE: undefined },
    product: {
      TRIAL: 20,
      BASIC: undefined,
      PRO: undefined,
      ENTERPRISE: undefined,
    }, // No limits for BASIC and PRO
    packet: {
      TRIAL: 5,
      BASIC: undefined,
      PRO: undefined,
      ENTERPRISE: undefined,
    }, // No limits for BASIC and PRO
    user: { TRIAL: 4, BASIC: 5, PRO: 10, ENTERPRISE: undefined },
  }

  // Validation logic
  const isValid = (len: number | undefined, limit: number | undefined) =>
    typeof len === "undefined" || limit === undefined || len < limit

  return (
    isValid(poolTableLen, limits.poolTable[subscription]) &&
    isValid(productLen, limits.product[subscription]) &&
    isValid(packetLen, limits.packet[subscription]) &&
    isValid(userLen, limits.user[subscription])
  )
}

export function percentToDecimal(num: number): number {
  // Convert to decimal and round to two decimals
  const decimal = num / 100
  return parseFloat(decimal.toFixed(2))
}

export function decimalToPercent(decimal: number): number {
  // Convert back to percentage and ensure two decimals
  const percentage = decimal * 100
  return parseFloat(percentage.toFixed(0))
}
