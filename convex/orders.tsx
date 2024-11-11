import { ConvexError, v } from "convex/values"
import { query } from "./_generated/server"
import { protectedProcedure, zQuery } from "./helpers"
import { getAuthUserId } from "@convex-dev/auth/server"

export const findAll = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    return await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", args.companyId))
      .collect()
  },
})
export const findAllSortedByDate = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    // notEqual: v.array(
    //   v.union(
    //     v.literal("OPEN"),
    //     v.literal("PENDING"),
    //     v.literal("PAID"),
    //     v.literal("ARCHIVE"),
    //   ),
    // ),
  },
  handler: async (ctx, args) => {
    // protectedProcedure
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Please signed in!")
    const user = userId !== null ? await ctx.db.get(userId) : null

    // src -> https://docs.convex.dev/database/reading-data#filtering
    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", user?.companyId!))
      .filter((q) =>
        q.and(
          q.eq(q.field("isBooking"), false),
          // q.neq(q.field("statusPayment"), args.notEqual),
          q.gt(q.field("_creationTime"), args.from!),
          q.lte(q.field("_creationTime"), args.to!),
        ),
      )
      .order("desc")
      .collect()

    return Promise.all(
      (orders ?? []).map(async (order) => {
        const poolRental = await ctx.db
          .query("poolRentals")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .unique()
        const poolTable = await ctx.db.get(poolRental?.poolTableId!)
        const orderlines = await ctx.db
          .query("orderlines")
          .withIndex("orderId", (q) => q.eq("orderId", order._id))
          .collect()
        const customer = order.customerId
          ? await ctx.db.get(order.customerId)
          : undefined

        return {
          ...order,
          poolRental: {
            poolTable: {
              id: poolTable?._id,
              name: poolTable?.name,
            },
          },
          orderlines,
          createdBy: {
            name: user?.name,
            role: user?.role,
          },
          customer: {
            name: customer?.name,
            phone: customer?.phone,
          },
        }
      }),
    )
  },
})

export const findById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await protectedProcedure(ctx, {})

    return await ctx.db.get(args.id)
  },
})
