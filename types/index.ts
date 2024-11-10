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

export enum PaymentMethod {
  CASH,
  DEBIT,
  CREDIT,
}

export type Rate = "minute" | "hour"
export enum RateEnum {
  MINUTE,
  HOUR,
}

export enum StatusPayment {
  OPEN,
  PENDING,
  PAID,
  ARCHIVE,
}
