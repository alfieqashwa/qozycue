import { getAuthUserId } from "@convex-dev/auth/server"
import { query } from "./_generated/server"

// source -> https://stack.convex.dev/convex-auth
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    return userId !== null ? ctx.db.get(userId) : null
  },
})
