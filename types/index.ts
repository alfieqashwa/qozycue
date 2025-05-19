import { countries } from "@/lib/countries"
import { z } from "zod"

export type Role =
  | "ZENITH"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "USER"
  | undefined
export enum RoleEnum {
  ZENITH,
  ADMIN,
  MANAGER,
  OWNER,
  CASHIER,
  USER,
}

export type Subscription = "TRIAL" | "BASIC" | "PRO" | "ENTERPRISE"
export enum SubscriptionEnum {
  TRIAL,
  BASIC,
  PRO,
  ENTERPRISE,
}

export type Status = "enabled" | "disabled"
export enum StatusEnum {
  enabled,
  disabled,
}

export type PaymentMethod = "CASH" | "DEBIT" | "CREDIT"
export enum PaymentMethodEnum {
  CASH,
  DEBIT,
  CREDIT,
}

export type Rate = "MINUTE" | "HOUR"
export enum RateEnum {
  MINUTE,
  HOUR,
}

export type StatusPayment =
  | "OPEN"
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "REFUND"
  | "ARCHIVE"
export enum StatusPaymentEnum {
  OPEN,
  PENDING,
  PAID,
  CANCELLED,
  REFUND,
  ARCHIVE,
}

export type OrderlineStatus = "ORDERED" | "UNORDERED"

export const countrySchema = z.object({
  code: z.string().length(2),
  country: z.string(),
  currency: z.string().length(3),
  locale: z.string(),
  flag: z.string().url(),
})

export type ICountry = z.infer<typeof countrySchema>

export const countryCodes = countries.map((c) => c.code) as [
  string,
  ...string[],
]
export const countryCodeSchema = z.enum(countryCodes)
export type CountryCode = z.infer<typeof countryCodeSchema>
