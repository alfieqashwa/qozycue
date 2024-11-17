import { ConvexError } from "convex/values"
import { updateCustomerByOrderIdSchema } from "../types/schema/customer-schema"
import { protectedProcedure, zMutation } from "./helpers"

export const update = zMutation({
  args: { updateCustomerByOrderIdSchema },
  handler: async (
    ctx,
    { updateCustomerByOrderIdSchema: { orderId, name, phone } },
  ) => {
    await protectedProcedure(ctx, {})
    const order = await ctx.db.get(orderId)
    if (!order) throw new ConvexError("No Order ID provided!")

    return await ctx.db.patch(order?.customerId!, {
      name,
      phone,
    })
  },
})
