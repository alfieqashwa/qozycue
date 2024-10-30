import { getAuthSessionId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"
import { query } from "./_generated/server"

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
