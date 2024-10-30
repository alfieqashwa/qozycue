export type Role =
  | "DEWA"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "USER"
  | undefined

export enum PaymentMethod {
  CASH,
  DEBIT,
  CREDIT,
}

export enum Rate {
  MINUTE,
  HOUR,
}

export enum Status {
  enabled,
  disabled,
}

export enum StatusPayment {
  OPEN,
  PENDING,
  PAID,
  ARCHIVE,
}
