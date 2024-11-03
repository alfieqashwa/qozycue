import { Subscription } from "@/types"

interface ValidationParams {
  status: "error" | "success" | "pending"
  subscription: Subscription
  poolTableLen?: number
  productLen?: number
  packetLen?: number
  userLen?: number
}

//? Source -> https://chatgpt.com/c/66ebf326-a3a4-8002-ba16-560775196c62
export function validateSubscriptionLimits({
  status,
  subscription,
  poolTableLen,
  productLen,
  packetLen,
  userLen,
}: ValidationParams): boolean | undefined {
  if (status !== "success") return false // Make sure it returns false if not successful

  // Max limits for different subscription levels
  const limits = {
    poolTable: { TRIAL: 10, BASIC: 20, PRO: 40, ENTERPRISE: undefined },
    product: {
      TRIAL: 20,
      BASIC: undefined,
      PRO: undefined,
      ENTERPRISE: undefined,
    }, // No limits for BASIC and PRO
    packet: {
      TRIAL: 5,
      BASIC: undefined,
      PRO: undefined,
      ENTERPRISE: undefined,
    }, // No limits for BASIC and PRO
    user: { TRIAL: 3, BASIC: 5, PRO: 10, ENTERPRISE: undefined },
  }

  // Validation logic
  const isValid = (len: number | undefined, limit: number | undefined) =>
    typeof len === "undefined" || limit === undefined || len < limit

  return (
    isValid(poolTableLen, limits.poolTable[subscription]) &&
    isValid(productLen, limits.product[subscription]) &&
    isValid(packetLen, limits.packet[subscription]) &&
    isValid(userLen, limits.user[subscription])
  )
}
