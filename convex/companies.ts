import { getAuthUserId } from "@convex-dev/auth/server"
import { NoOp } from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod"
import { v } from "convex/values"
import { createTrialCompanySchema } from "../types/schema/company-schema"
import { mutation, query } from "./_generated/server"
import { zMutation } from "./helpers"

// Make this once, to use anywhere you would have used "query"

// === QUERIES ===
export const find = query({
  args: { id: v.id("companies") },
  handler: async (ctx, { id }) => {
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

    const createCompany = await ctx.db.insert("companies", {
      name,
      slug: name.replace(/ /g, "-"),
      phone,
      location,
      isPublished: true,
      subscription: "TRIAL",
    })

    if (!createCompany) throw new Error("No companyId")

    const updateUserRole = await ctx.db.patch(userId, {
      role: "ADMIN",
      companyId: createCompany,
    })

    return { createCompany, updateUserRole }
  },
})
