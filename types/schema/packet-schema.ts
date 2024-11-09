import { zid } from "convex-helpers/server/zod"
import { z } from "zod"
import { Rate } from ".."

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
  rate: z.nativeEnum(Rate),
})
export type TPacket = z.infer<typeof packetSchema>
export const createPacketSchema = packetSchema.omit({ id: true })
export type TcreatePacket = z.infer<typeof createPacketSchema>

export const deletePacketSchema = packetSchema.pick({ id: true })

export const deleteSelectedPacketSchema = z.object({
  ids: z.array(packetSchema.pick({ id: true })),
})
