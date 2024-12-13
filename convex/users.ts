import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  updateRoleByIdOnlyForSuperAminSchema,
  updateRoleByIdSchema,
  updateUserSchema,
  upsertUserSchema,
} from "../types/schema/user-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  protectedProcedure,
  subscriptions,
  superAdminProcedure,
  validateSubscriptionLimits,
  zMutation,
} from "./helpers"

// source -> https://stack.convex.dev/convex-auth
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    return user
  },
})

export const findUserWithCompany = query({
  args: {
    userId: v.optional(v.id("users")),
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    if (!args.userId) throw new ConvexError("No User ID was provided!")
    const user = await ctx.db.get(args.userId)

    if (!args.companyId) throw new ConvexError("No Company ID was provided!")
    const company = await ctx.db.get(args.companyId)

    return { user, company }
  },
})

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await superAdminProcedure(ctx, {})

    const users = await ctx.db.query("users").collect()
    const usersWithCompany = Promise.all(
      users.map(async (user) => {
        const company =
          user.companyId != null ? await ctx.db.get(user.companyId) : null

        return { ...user, companyName: company?.name ?? "" }
      }),
    )

    return usersWithCompany
  },
})

export const findAllByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    const usersByCompanyId = await ctx.db
      .query("users")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()
    const usersIncludeCompanyName = Promise.all(
      usersByCompanyId.map(async (user) => {
        const company = !!user.companyId
          ? await ctx.db.get(user.companyId)
          : null

        return { ...user, companyName: company?.name ?? "" }
      }),
    )
    return usersIncludeCompanyName
  },
})

// === MUTATIONS ===

export const updateRoleAndCompanyId = zMutation({
  args: { updateUserSchema },
  handler: async (ctx, { updateUserSchema: { id, role, companyId } }) => {
    await superAdminProcedure(ctx, {})

    return await ctx.db.patch(id, {
      role,
      companyId,
    })
  },
})
export const updateRoleByIdOnlyForSuperAmin = zMutation({
  args: { updateRoleByIdOnlyForSuperAminSchema },
  handler: async (
    ctx,
    { updateRoleByIdOnlyForSuperAminSchema: { id, role } },
  ) => {
    await superAdminProcedure(ctx, {})
    return await ctx.db.patch(id, { role })
  },
})

export const updateRoleByIdAdminProcedure = zMutation({
  args: { updateRoleByIdSchema },
  handler: async (ctx, { updateRoleByIdSchema: { id, role } }) => {
    await adminProcedure(ctx, {})
    return await ctx.db.patch(id, { role })
  },
})

export const upsertSuperAdminProcedure = zMutation({
  args: { upsertUserSchema },
  handler: async (ctx, { upsertUserSchema: { email, role, companyId } }) => {
    await superAdminProcedure(ctx, {})

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique()

    let upsert

    if (!user) {
      // if no-user, then createTeam
      upsert = await ctx.db.insert("users", {
        email,
        role,
        companyId,
      })
    } else {
      /*
       * this is for user who's already on portal page,
       * which didn't create a company.
       * And whether user has companyId or not,
       * retrieve anyway. No impact for this case!
       */
      upsert = await ctx.db.patch(user._id, {
        role,
        companyId,
      })
    }
    return upsert
  },
})

export const upsertAdminProcedure = zMutation({
  args: { upsertUserSchema },
  handler: async (ctx, { upsertUserSchema: { email, role, companyId } }) => {
    await adminProcedure(ctx, {})

    // Validate user's limit based on company's subscriptions
    const subs = await subscriptions(ctx, { companyId })
    const isValid = validateSubscriptionLimits({
      subscription: subs.subscription!,
      userLen: subs._count.users,
    })

    if (!isValid) throw new ConvexError("Max user limit exceeded!")

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique()

    let upsert

    if (!user) {
      // if no-user, then createTeam
      upsert = await ctx.db.insert("users", {
        email,
        role,
        companyId,
      })
    } else {
      /*
       * this is for user who's already on portal page,
       * which didn't create a company.
       * And whether user has companyId or not,
       * retrieve anyway. No impact for this case!
       */
      upsert = await ctx.db.patch(user._id, {
        role,
        companyId,
      })
    }
    return upsert
  },
})

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx, {})
    return await ctx.db.delete(args.id)
  },
})
export const removeAdminProcedure = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await adminProcedure(ctx, {})
    return await ctx.db.delete(args.id)
  },
})
