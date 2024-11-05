import { getAuthSessionId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { adminProcedure, superAdminProcedure } from "./helpers"

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

    const removeAllSessions = Promise.all(
      sessions.map(async (session) => {
        return await ctx.db.delete(session._id)
      }),
    )

    return removeAllSessions
  },
})
