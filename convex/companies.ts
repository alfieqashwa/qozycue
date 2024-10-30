import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import {
  createCompanySchema,
  createTrialCompanySchema,
  updateCompanyDewaSchema,
} from "../types/schema/company-schema"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { reset, zMutation } from "./helpers"

// Make this once, to use anywhere you would have used "query"

// === QUERIES ===
export const findAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    // if (user?.role !== "DEWA") throw new Error("Don't have access!")

    return await ctx.db.query("companies").collect()
  },
})

export const find = query({
  args: { id: v.optional(v.id("companies")) },
  handler: async (ctx, { id }) => {
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
      !user || !user.companyId ? null : await ctx.db.get(user.companyId)

    return company?.slug // slug type -> string | undefined is as expected
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
    const userId = await getAuthUserId(ctx)
    const user = !!userId ? await ctx.db.get(userId) : null
    if (user?.role !== "DEWA") throw new Error("Don't have access!")

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
    {
      updateCompanyDewaSchema: {
        id,
        name,
        phone,
        location,
        isPublished,
        subscription,
      },
    },
  ) => {
    const userId = await getAuthUserId(ctx)
    const user = !!userId ? await ctx.db.get(userId) : null
    if (user?.role !== "DEWA") throw new Error("Don't have access!")

    return await ctx.db.patch(id, {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished,
      subscription,
    })
  },
})

export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const user = !!userId ? await ctx.db.get(userId) : null
    if (user?.role !== "DEWA") throw new Error("Don't have access!")

    return await ctx.db.delete(args.id)
  },
})
// === Only for Development ===

export const resetAll = mutation({
  args: { forReal: v.string() },
  handler: async (ctx, args) => {
    return await reset(ctx, { forReal: args.forReal })
  },
})
