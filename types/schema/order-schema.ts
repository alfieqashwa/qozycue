import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

// Start Booking
export const bookingSchema = z.object({
  gapDuration: z.number().min(5).max(15).nonnegative(),
  orderId: zid("orders"),
  startTime: z.number({
    required_error: "Start Time is required",
    invalid_type_error: "Start Time must be a date.",
  }),
  customerName: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string.",
    })
    .min(3)
    .max(25),
  customerPhone: z
    .string({
      required_error: "Phone is required",
    })
    .min(11)
    .max(12),
  poolTableId: zid("poolTables"),
  packetId: zid("packets"),
  duration: z.coerce
    .number({
      required_error: "Duration is required",
      invalid_type_error: "Duration must be a number.",
    })
    .nonnegative({ message: "Cost Price must be 0 or a positive number." })
    .max(6)
    .default(0),
  cost: z.coerce
    .number({
      required_error: "Cost Price is required.",
      invalid_type_error: "Cost Price must be a number.",
    })
    .nonnegative({ message: "Cost Price must be 0 or a positive number." }),
})
export const createBookingSchema = bookingSchema.omit({ orderId: true })
export type TCreateBooking = z.infer<typeof createBookingSchema>

export const startBookingTimerSchema = z.object({
  openAndNotBookingOrderId: zid("orders").optional(),
  orderId: zid("orders"),
  poolTableId: zid("poolTables"),
  startTime: z.number(),
  endTime: z.number(),
})
export type TStartBookingTimer = z.infer<typeof startBookingTimerSchema>
export type TBooking = z.infer<typeof bookingSchema>

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

export const updateDurationSchema = z.object({
  orderId: zid("orders"),
  poolTableId: zid("poolTables"),
  poolRentalId: zid("poolRentals"),
  updatedDuration: z.coerce.number().nonnegative().min(1).max(5),
  packetCost: z.coerce
    .number({
      required_error: "Cost is required.",
      invalid_type_error: "Cost must be a number.",
    })
    .nonnegative({ message: "Cost must be zero or a positive number." }),
})
export type TUpdateDuration = z.infer<typeof updateDurationSchema>
