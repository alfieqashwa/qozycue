export type Role =
  | "DEWA"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "USER"
  | undefined
export enum RoleEnum {
  DEWA,
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
  | "CANCELLED"
  | "PAID"
  | "ARCHIVE"
export enum StatusPaymentEnum {
  OPEN,
  PENDING,
  PAID,
  ARCHIVE,
}
