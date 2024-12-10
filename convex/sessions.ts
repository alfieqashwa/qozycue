import { getAuthSessionId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { adminProcedure, reset, superAdminProcedure } from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    await superAdminProcedure(ctx, {})
    return await ctx.db.query("authSessions").collect()
  },
})

export const find = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx)
    const session = sessionId !== null ? await ctx.db.get(sessionId) : null

    const currentUser =
      session !== null ? await ctx.db.get(session?.userId as Id<"users">) : null
    const company =
      currentUser !== null
        ? await ctx.db.get(currentUser?.companyId as Id<"companies">)
        : null
    return {
      ...session,
      companyId: company?._id,
      companySlug: company?.slug,
      user: {
        ...currentUser,
      },
    }
  },
})

export const deleteAllByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await adminProcedure(ctx, {})

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
        const removeRefreshToken = await ctx.db.delete(refreshToken._id)
        removeAllRefreshTokens.push(removeRefreshToken)
      }

      const removeSession = await ctx.db.delete(session._id)
      removeAllSessions.push(removeSession)
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect()

    for (const account of accounts) {
      const removeAccount = await ctx.db.delete(account._id)
      removeAllAccounts.push(removeAccount)
    }

    return { removeAllRefreshTokens, removeAllSessions, removeAllAccounts }
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
