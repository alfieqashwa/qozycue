import { getAuthUserId } from "@convex-dev/auth/server"
import { NoOp } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod"
import { v } from "convex/values"
import { createTrialCompanySchema } from "../types/schema/company-schema"
import { mutation, query } from "./_generated/server"

// Make this once, to use anywhere you would have used "query"
const zQuery = zCustomQuery(query, NoOp)
const zMutation = zCustomMutation(mutation, NoOp)

// === QUERIES ===
export const findCompanyByUserId = query({
  args: { userId: v.id("users") || null },
  handler: async (ctx, { userId }) => {
    if (!userId) return null

    const company = await ctx.db
      .query("companies")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect()
    return company
  },
})

export const slug = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const company = await ctx.db
      .query("companies")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first()
    return company?.slug
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

    const createCompany = await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      subscriptions: "TRIAL",
      userId,
    })
    const updateUserRole = await ctx.db.patch(userId, { role: "ADMIN" })

    return { createCompany, updateUserRole }
  },
})
