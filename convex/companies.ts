import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createCompanySchema,
  createTrialCompanySchema,
  toggleCustomLossMinuteSchema,
  toggleIsPublishedSchema,
  toggleIsStockableSchema,
  updateCompanyByAdminSchema,
  updateCompanyZenithSchema,
} from "../types/schema/company-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  createTrialCompany,
  superAdminProcedure,
  zMutation,
} from "./helpers"

// Make this once, to use anywhere you would have used "query"

// === QUERIES ===
export const findPublicProcedure = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
  },
})

export const findAllSuperAdminProcedure = query({
  args: {},
  handler: async (ctx) => {
    await superAdminProcedure(ctx)
    return await ctx.db.query("companies").collect()
  },
})

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user) throw new ConvexError("No user provided!")

    return await ctx.db.query("companies").collect()
  },
})

export const find = query({
  args: { id: v.optional(v.id("companies")) },
  handler: async (ctx, { id }) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user) throw new ConvexError("No user provided!")

    if (!id) {
      return user.companyId ? await ctx.db.get(user.companyId) : null
    } else {
      return await ctx.db.get(id)
    }
  },
})

export const slug = query({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx)
      if (!userId) return null

      const user = await ctx.db.get(userId)
      if (!user) {
        return null
      }

      const company = user.companyId ? await ctx.db.get(user.companyId) : null

      return company?.slug // slug type -> string | undefined is as expected
    } catch (error) {
      // Log the error server-side but return null to the client
      console.error("Error in slug query:", error)
      return null
    }
  },
})

// === MUTATIONS ===
export const createTrial = zMutation({
  args: { createTrialCompanySchema },
  handler: async (
    ctx,
    { createTrialCompanySchema: { name, phone, countryCode, location } },
  ) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError("Not signed in")
    }

    const companyId = await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      countryCode,
      isPublished: true,
      isStockable: true,
      subscription: "TRIAL",
      customLossMinute: false,
    })
    if (!companyId) throw new ConvexError("No companyId")

    return await createTrialCompany(ctx, { userId, companyId })
  },
})

export const create = zMutation({
  args: { createCompanySchema },
  handler: async (
    ctx,
    { createCompanySchema: { name, phone, countryCode, location } },
  ) => {
    await superAdminProcedure(ctx)

    return await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      countryCode,
      location,
      isPublished: true,
      isStockable: true,
      subscription: "TRIAL",
      customLossMinute: false,
    })
  },
})

export const update = zMutation({
  args: { updateCompanyZenithSchema },
  handler: async (
    ctx,
    { updateCompanyZenithSchema: { id, name, phone, location, subscription } },
  ) => {
    await superAdminProcedure(ctx)

    return await ctx.db.patch(id, {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      subscription,
    })
  },
})

export const updateAdminProcedure = zMutation({
  args: { updateCompanyByAdminSchema },
  handler: async (
    ctx,
    { updateCompanyByAdminSchema: { id, phone, location, countryCode } },
  ) => {
    await adminProcedure(ctx)

    return await ctx.db.patch(id, {
      phone,
      location,
      countryCode,
    })
  },
})

/* Remove comapny including its relation tables:
 * orders
 * taxes
 * discounts
 * customers
 * poolTables
 * packets
 * products
 * users
 * company
 * src -> note.md
 */
// For now, remove a company manually from db to avoid lack of over consupmption limits database usage
export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx)

    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const taxes = await ctx.db
      .query("taxes")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const discounts = await ctx.db
      .query("discounts")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const customers = await ctx.db
      .query("customers")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const poolTables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const packets = await ctx.db
      .query("packets")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const products = await ctx.db
      .query("products")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    const users = await ctx.db
      .query("users")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()

    await Promise.all(orders.map((order) => ctx.db.delete(order._id)))
    await Promise.all(taxes.map((tax) => ctx.db.delete(tax._id)))
    await Promise.all(discounts.map((discount) => ctx.db.delete(discount._id)))
    await Promise.all(customers.map((customer) => ctx.db.delete(customer._id)))
    await Promise.all(
      poolTables.map((poolTable) => ctx.db.delete(poolTable._id)),
    )
    await Promise.all(packets.map((packet) => ctx.db.delete(packet._id)))
    await Promise.all(products.map((product) => ctx.db.delete(product._id)))
    await Promise.all(
      users.map(async (user) => {
        const authAccounts = await ctx.db
          .query("authAccounts")
          .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id))
          .collect()
        const authSessions = await ctx.db
          .query("authSessions")
          .withIndex("userId", (q) => q.eq("userId", user._id))
          .collect()

        await Promise.all(
          authAccounts.map((account) => ctx.db.delete(account._id)),
        )
        await Promise.all(
          authSessions.map((session) => ctx.db.delete(session._id)),
        )
        await ctx.db.delete(user._id)
      }),
    )
    await ctx.db.delete(args.id)

    return {
      removeOrders: orders.length,
      removeTaxes: taxes.length,
      removeDiscounts: discounts.length,
      removeCustomers: customers.length,
      removePoolTables: poolTables.length,
      removePackets: packets.length,
      removeProducts: products.length,
      removeusers: users.length,
      removeCompany: true,
    }
  },
})

export const toggleIsPublished = zMutation({
  args: { toggleIsPublishedSchema },
  handler: async (ctx, { toggleIsPublishedSchema: { id, isPublished } }) => {
    await adminProcedure(ctx)
    return await ctx.db.patch(id, { isPublished: !isPublished })
  },
})

export const toggleIsStockable = zMutation({
  args: { toggleIsStockableSchema },
  handler: async (ctx, { toggleIsStockableSchema: { id, isStockable } }) => {
    await adminProcedure(ctx)
    return await ctx.db.patch(id, { isStockable: !isStockable })
  },
})

export const toggleCustomLossMinute = zMutation({
  args: { toggleCustomLossMinuteSchema },
  handler: async (
    ctx,
    { toggleCustomLossMinuteSchema: { id, customLossMinute } },
  ) => {
    await superAdminProcedure(ctx)
    return await ctx.db.patch(id, { customLossMinute: !customLossMinute })
  },
})
