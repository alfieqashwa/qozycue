import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import {
  createCompanySchema,
  createTrialCompanySchema,
  toggleIsPublishedSchema,
  updateCompanyByAdminSchema,
  updateCompanyDewaSchema,
} from "../types/schema/company-schema"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  protectedProcedure,
  reset,
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

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await superAdminProcedure(ctx, {})

    return await ctx.db.query("companies").collect()
  },
})

export const find = query({
  args: { id: v.optional(v.id("companies")) },
  handler: async (ctx, { id }) => {
    await protectedProcedure(ctx, {})

    if (!id) return
    const company = await ctx.db.get(id)
    return company
  },
})

export const slug = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null

    const company =
      !!user && !!user.companyId ? await ctx.db.get(user.companyId) : null

    return company?.slug // slug type -> string | undefined is as expected
  },
})

//? this API will be used to validate the client based on its subscriptions.
// subscriptions: protectedProcedure.query(async ({ ctx }) => {
//   return await ctx.db.company.findUnique({
//     where: { id: ctx.session.user.companyId as string },
//     select: {
//       subscription: true,
//       _count: {
//         select: {
//           users: true,
//           pooltables: true,
//           products: true,
//           packets: true,
//         },
//       },
//     },
//   })
// }),

//? this API will be used to validate the client based on its subscriptions.
export const subscriptions = query({
  args: { companyId: v.optional(v.id("companies")) },
  handler: async (ctx, { companyId }) => {
    await superAdminProcedure(ctx, {})

    if (!companyId) throw new Error("No company!")
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

    const _count = {
      users: users.length,
      poolTables: poolTables.length,
      products: products.length,
      packets: packets.length,
    }

    return { subscription: company?.subscription, _count }
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
      throw new Error("Not signed in")
    }

    const companyId = await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      subscription: "TRIAL",
    })

    if (!companyId) throw new Error("No companyId")

    const updateUserRole = await ctx.db.patch(userId, {
      role: "ADMIN",
      companyId,
    })

    type TData = {
      companyId: Id<"companies">
      name: string
      description: string
      isActive: boolean
      gapDuration: number
      status: "enabled" | "disabled"
    }

    const data: TData[] = Array.from({ length: 10 }, (_, i) => ({
      companyId,
      name: `${i + 1}`,
      description: `table-${i + 1}`,
      isActive: false,
      gapDuration: 10,
      status: "enabled",
    }))
    let insertedIds: Id<"poolTables">[] = [] // array to store the inserted IDs

    await Promise.all(
      data.map(async (table) => {
        const result = await ctx.db.insert("poolTables", table)
        insertedIds.push(result)
      }),
    )

    return { companyId, updateUserRole, insertedIds }
  },
})

export const create = zMutation({
  args: { createCompanySchema },
  handler: async (ctx, { createCompanySchema: { name, phone, location } }) => {
    await superAdminProcedure(ctx, {})

    return await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      subscription: "TRIAL",
    })
  },
})

export const update = zMutation({
  args: { updateCompanyDewaSchema },
  handler: async (
    ctx,
    { updateCompanyDewaSchema: { id, name, phone, location, subscription } },
  ) => {
    await superAdminProcedure(ctx, {})

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
    await adminProcedure(ctx, {})

    return await ctx.db.patch(id, {
      phone,
      location,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx, {})

    return await ctx.db.delete(args.id)
  },
})

export const toggleIsPublished = zMutation({
  args: { toggleIsPublishedSchema },
  handler: async (ctx, { toggleIsPublishedSchema: { id, isPublished } }) => {
    await adminProcedure(ctx, {})
    return await ctx.db.patch(id, { isPublished: !isPublished })
  },
})

// === Only for Development ===

export const resetAll = mutation({
  args: { forReal: v.string() },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx, {})
    return await reset(ctx, { forReal: args.forReal })
  },
})
