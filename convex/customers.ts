import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError } from "convex/values"
import {
  createCustomerSchema,
  updateCustomerByOrderIdSchema,
} from "../types/schema/customer-schema"
import { protectedProcedure, zMutation } from "./helpers"

export const create = zMutation({
  args: { createCustomerSchema },
  handler: async (ctx, { createCustomerSchema: { name, phone } }) => {
    // protectedProcedure(ctx)
    const userId = await getAuthUserId(ctx)
    const user = userId !== null ? await ctx.db.get(userId) : null
    if (!user) throw new ConvexError("You do not have access!")
    if (!user.companyId) return null

    const customerId = await ctx.db.insert("customers", {
      companyId: user.companyId,
      name,
      phone,
    })

    return await ctx.db.insert("orders", {
      companyId: user.companyId,
      statusPayment: "OPEN",
      createdBy: user._id,
      customerId: customerId,
      isDeleted: false,
    })
  },
})

export const update = zMutation({
  args: { updateCustomerByOrderIdSchema },
  handler: async (
    ctx,
    { updateCustomerByOrderIdSchema: { orderId, name, phone } },
  ) => {
    await protectedProcedure(ctx)
    const order = await ctx.db.get(orderId)
    if (!order) throw new ConvexError("No Order ID provided!")

    return await ctx.db.patch(order?.customerId!, {
      name,
      phone,
    })
  },
})
