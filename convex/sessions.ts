import { getAuthSessionId } from "@convex-dev/auth/server"
import { query } from "./_generated/server"
import { Id } from "./_generated/dataModel"

export const currentSession = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx)
    const session = sessionId !== null ? await ctx.db.get(sessionId) : null

    const currentUser = await ctx.db.get(session?.userId as Id<"users">)
    return {
      ...session,
      user: { companyId: currentUser?.companyId, role: currentUser?.role },
    }
  },
})
