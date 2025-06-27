import ConvexAgent from "@convex-dev/agent"
import { internal } from "./_generated/api"
import { v } from "convex/values"
import { action, internalQuery } from "./_generated/server"

const agent = new ConvexAgent({
  systemPrompt: `You are a helpful assistant for the Qozy Cue billiard and cafe application.
You can help users understand their business data, sales, orders, and other metrics.
Be concise and precise in your answers. Use numbers and facts when available.
Always mention the time period you're referring to in your answers.`,
})

// Function to get agent response
export const chat = action({
  args: { message: v.string() },
  handler: async (ctx, { message }) => {
    // Define functions the agent can use
    const functions = {
      // Get sales data for a given time period
      getSalesData: async (from?: number, to?: number) => {
        return await ctx.runQuery(internal.orders._sumRevenue, { from, to })
      },

      // Get payment methods breakdown
      getPaymentMethods: async (from?: number, to?: number) => {
        return await ctx.runQuery(internal.orders._groupByPaymentMethod, {
          from,
          to,
        })
      },

      // Get all transactions
      getTransactions: async (from?: number, to?: number) => {
        return await ctx.runQuery(internal.orders.printTransaction, {
          from,
          to,
        })
      },
    }

    // Run the agent with the user's message
    const response = await agent.run(message, functions)
    return response
  },
})

// Helper function to format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount)
}
