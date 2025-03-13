import { getAuthSessionId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { adminProcedure, reset, superAdminProcedure } from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await adminProcedure(ctx)
    return await ctx.db.query("authSessions").collect()
  },
})

export const find = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx)
    // Safely retrieve session
    const session = sessionId ? await ctx.db.get(sessionId) : null

    // Safely retrieve current user
    const userId = session?.userId
    const user = userId ? await ctx.db.get(userId as Id<"users">) : null

    // Safely retrieve company
    const companyId = user?.companyId
    const company = companyId
      ? await ctx.db.get(companyId as Id<"companies">)
      : null

    // console.log("sessionId:", sessionId)
    // console.log("userId:", userId)
    // console.log("companyId:", companyId)
    return {
      ...session,
      user: {
        ...user,
        company,
      },
    }
  },
})

export const deleteAllByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await adminProcedure(ctx)

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect()

    const removeAllRefreshTokens = []
    const removeAllSessions = []
    const removeAllAccounts = []

    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect()

      for (const refreshToken of refreshTokens) {
        const removeRefreshToken =
          refreshToken._id != null
            ? await ctx.db.delete(refreshToken._id)
            : null
        removeAllRefreshTokens.push(removeRefreshToken)
      }

      const removeSession =
        session._id != null ? await ctx.db.delete(session._id) : null
      removeAllSessions.push(removeSession)
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect()

    for (const account of accounts) {
      const removeAccount =
        account._id != null ? await ctx.db.delete(account._id) : null
      removeAllAccounts.push(removeAccount)
    }
  },
})

// === Only for Development ===

export const resetAll = mutation({
  args: { forReal: v.string() },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx)
    return await reset(ctx, { forReal: args.forReal })
  },
})
