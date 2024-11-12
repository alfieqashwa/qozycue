import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const packetSchema = z.object({
  id: zid("packets"),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(3, { message: "Name must be at least 1 characters." })
    .max(30, { message: "Name must contain at most 30 character(s)." }),
  description: z.string().max(30),
  cost: z.coerce
    .number({
      required_error: "Cost is required.",
      invalid_type_error: "Cost must be a number.",
    })
    .nonnegative({ message: "Cost must be zero or a positive number." }),
  rate: z.enum(["MINUTE", "HOUR"]),
  status: z.enum(["enabled", "disabled"]),
})
export type TPacket = z.infer<typeof packetSchema>

export const createPacketSchema = packetSchema.omit({ id: true, status: true })
export type TCreatePacket = z.infer<typeof createPacketSchema>

export const updatePacketSchema = packetSchema.omit({ status: true })
export type TUpdatePacket = z.infer<typeof updatePacketSchema>

export const deletePacketSchema = packetSchema.pick({ id: true })

export const togglePacketSchema = packetSchema.pick({ id: true, status: true })
