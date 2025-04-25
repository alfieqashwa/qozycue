import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"
import {
  createPacketSchema,
  deletePacketSchema,
  togglePacketSchema,
  updatePacketSchema,
} from "../types/schema/packet-schema"
import { mutation, query } from "./_generated/server"
import {
  adminProcedure,
  managerProcedure,
  subscriptions,
  validateSubscriptionLimits,
  zMutation,
} from "./helpers"

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    //? findAll mostly are protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")

    const user = await ctx.db.get(userId)
    if (!user || !user?.companyId) throw new ConvexError("No user!")

    return await ctx.db
      .query("packets")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .collect()
  },
})
export const create = zMutation({
  args: { createPacketSchema },
  handler: async (
    ctx,
    { createPacketSchema: { name, description, cost, rate } },
  ) => {
    //? managerProcedure
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (
      user?.role !== "ZENITH" &&
      user?.role !== "ADMIN" &&
      user?.role !== "MANAGER"
    ) {
      throw new ConvexError("You do not have access!")
    }
    if (!user) throw new ConvexError("No user!")

    const subs = await subscriptions(ctx, { companyId: user.companyId })
    const isValid = validateSubscriptionLimits({
      subscription: subs.subscription!,
      productLen: subs._count.packets,
    })
    if (!isValid) throw new ConvexError("Max product limit exceeded!")

    return await ctx.db.insert("packets", {
      companyId: user?.companyId!,
      name,
      description,
      cost,
      status: "disabled",
      rate,
    })
  },
})
export const update = zMutation({
  args: { updatePacketSchema },
  handler: async (
    ctx,
    { updatePacketSchema: { id, name, description, cost, rate } },
  ) => {
    await managerProcedure(ctx)

    return await ctx.db.patch(id, {
      name,
      description,
      cost,
      rate,
    })
  },
})
export const toggle = zMutation({
  args: { togglePacketSchema },
  handler: async (ctx, { togglePacketSchema: { id, status } }) => {
    await managerProcedure(ctx)

    return await ctx.db.patch(id, {
      status: status === "enabled" ? "disabled" : "enabled",
    })
  },
})
/**
 * remove && removeSelected is AdminProcedure.
 */
export const remove = zMutation({
  args: { deletePacketSchema },
  handler: async (ctx, { deletePacketSchema: { id } }) => {
    await adminProcedure(ctx)

    return await ctx.db.delete(id)
  },
})
