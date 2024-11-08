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

export function stringToFloat(str: string): number {
  const value = (Math.round(Number(str)) / 100).toFixed(2)
  return +value
}
