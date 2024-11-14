import { zid } from "convex-helpers/server/zod"
import { z } from "zod"

export const submitPaymentSchema = z.object({
  orderId: zid("orders"),
  // statusPayment: z.enum(["OPEN", "PENDING", "CANCELLED", "PAID", "ARCHIVE"]),
  tax: z.coerce.number(),
  discount: z.coerce.number(),
  paymentMethod: z.enum(["CASH", "DEBIT", "CREDIT"]),
  totalAmount: z.coerce
    .number({
      required_error: "Total Amount is required.",
      invalid_type_error: "Total Amount must be a number.",
    })
    .nonnegative({ message: "Total Amount must be 0 or a positive number." }),
  revenue: z.coerce
    .number({
      required_error: "Revenue is required.",
      invalid_type_error: "Revenue must be a number.",
    })
    .nonnegative({ message: "Revenue must be 0 or a positive number." }),
  note: z.string().max(99).optional(),
})

export type TSubmitPayment = z.infer<typeof submitPaymentSchema>

// export const submitPaymentCafeOnlySchema = submitPaymentSchema.omit({
//   statusPayment: true,
// })
// export type TSubmitPaymentCafeOnly = z.infer<typeof submitPaymentCafeOnlySchema>
