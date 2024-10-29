import { getAuthUserId } from "@convex-dev/auth/server"
import { query } from "./_generated/server"
import { zMutation } from "./helpers"

// source -> https://stack.convex.dev/convex-auth
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    return userId !== null ? ctx.db.get(userId) : null
  },
})

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect()
  },
})
