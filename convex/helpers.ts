import { authTables } from "@convex-dev/auth/server"
import { internalMutation, mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod"
import { NoOp } from "convex-helpers/server/customFunctions"

export const zQuery = zCustomQuery(query, NoOp)
export const zMutation = zCustomMutation(mutation, NoOp)

// Deletes all auth-related data.
// Just for demoing purposes, feel free to delete.
export const reset = internalMutation({
  args: { forReal: v.string() },
  handler: async (ctx, args) => {
    if (args.forReal !== "reset-batman") {
      throw new Error("You must know what you're doing to reset the database.")
    }
    for (const table of Object.keys(authTables)) {
      for (const { _id } of await ctx.db.query(table as any).collect()) {
        await ctx.db.delete(_id)
      }
    }
  },
})
