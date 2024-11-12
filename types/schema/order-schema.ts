import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

// Start Timer
export const startTimerSchema = z.object({
  poolTableId: zid("poolTables"),
  gapDuration: z.number().nonnegative().min(5).max(15),
  customerName: z.string().max(25).optional(),
  customerPhone: z.string().max(12).optional(),
  packetId: zid("packets"),
  duration: z.coerce
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number.",
    })
    .nonnegative({ message: "Cost Price must be 0 or a positive number." })
    .default(0),
  cost: z.coerce
    .number({
      required_error: "Cost Price is required.",
      invalid_type_error: "Cost Price must be a number.",
    })
    .nonnegative({ message: "Cost Price must be 0 or a positive number." }),
  rate: z.enum(["MINUTE", "HOUR"]),
})
export type TStartTimer = z.infer<typeof startTimerSchema>

export const stopTimerSchema = z.object({
  poolTableId: zid("poolTables"),
  poolRentalId: zid("poolRentals"),
  startTime: z.number().nonnegative(),
  endTime: z.number().nonnegative(),
  cost: z.coerce
    .number({
      required_error: "Cost Price is required.",
      invalid_type_error: "Cost Price must be a number.",
    })
    .nonnegative({ message: "Cost Price must be 0 or a positive number." }),
  rate: z.enum(["MINUTE", "HOUR"]),
})
export type TStopTimer = z.infer<typeof stopTimerSchema>
