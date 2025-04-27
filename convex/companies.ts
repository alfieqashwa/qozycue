import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createCompanySchema,
  createTrialCompanySchema,
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
    { createTrialCompanySchema: { name, phone, location } },
  ) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new ConvexError("Not signed in")
    }

    const companyId = await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      isStockable: true,
      subscription: "TRIAL",
    })
    if (!companyId) throw new ConvexError("No companyId")

    return await createTrialCompany(ctx, { userId, companyId })
  },
})

export const create = zMutation({
  args: { createCompanySchema },
  handler: async (ctx, { createCompanySchema: { name, phone, location } }) => {
    await superAdminProcedure(ctx)

    return await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      isStockable: true,
      subscription: "TRIAL",
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
    { updateCompanyByAdminSchema: { id, phone, location } },
  ) => {
    await adminProcedure(ctx)

    return await ctx.db.patch(id, {
      phone,
      location,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx)

    return await ctx.db.delete(args.id)
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
