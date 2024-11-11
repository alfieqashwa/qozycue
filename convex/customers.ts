import { updateCustomerSchema } from "../types/schema/customer-schema"
import { protectedProcedure, zMutation } from "./helpers"

export const update = zMutation({
  args: { updateCustomerSchema },
  handler: async (ctx, { updateCustomerSchema: { id, name, phone } }) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.patch(id, {
      name,
      phone,
    })
  },
})
