// export enum Role {
//   DEWA,
//   ADMIN,
//   MANAGER,
//   OWNER,
//   CASHIER,
//   USER,
// }

// const EnumRole = z.nativeEnum(Role)
// export type TRole = z.infer<typeof EnumRole>

export type Role =
  | "DEWA"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "USER"
  | undefined

export type Subscription = "TRIAL" | "BASIC" | "PRO" | "ENTERPRISE" | undefined
// export enum Subscription {
//   TRIAL,
//   BASIC,
//   PRO,
//   ENTERPRISE,
// }

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
