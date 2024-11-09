import { PaymentMethod, Rate, StatusEnum, StatusPayment } from "@/types"
import {
  Banknote,
  Coffee,
  CreditCard,
  Disc2,
  Hourglass,
  Key,
  PackageCheck,
  PackageX,
  ShoppingBasket,
  Soup,
  Timer,
  Wallet2,
  type LucideIcon,
} from "lucide-react"

enum Role {
  ADMIN,
  OWNER,
  MANAGER,
  CASHIER,
}

export type Options = {
  value: string
  label: string
  icon: LucideIcon
}

export const statusEnabled = [
  {
    value: StatusEnum.enabled,
    label: "Enabled",
    icon: PackageCheck,
  },
  {
    value: StatusEnum.disabled,
    label: "Disabled",
    icon: PackageX,
  },
]

export const packetRates = [
  {
    value: Rate.HOUR,
    label: "HOUR",
    icon: Hourglass,
  },
  {
    value: Rate.MINUTE,
    label: "MINUTE",
    icon: Timer,
  },
] as unknown as Options[]

export const statusPayments = [
  { value: StatusPayment.OPEN, label: "Open", icon: Disc2 },
  { value: StatusPayment.PENDING, label: "Pending", icon: Disc2 },
  { value: StatusPayment.PAID, label: "Paid", icon: Disc2 },
]

export const paymentMethods = [
  {
    value: PaymentMethod.CASH,
    label: "Cash",
    icon: Banknote,
  },
  {
    value: PaymentMethod.CREDIT,
    label: "Credit",
    icon: CreditCard,
  },
  {
    value: PaymentMethod.DEBIT,
    label: "Debit",
    icon: Wallet2,
  },
]

export const categories = [
  {
    value: "food",
    label: "Food",
    icon: Soup,
  },
  {
    value: "drink",
    label: "Drink",
    icon: Coffee,
  },
  {
    value: "others",
    label: "Others",
    icon: ShoppingBasket,
  },
]

export const roles = [
  {
    value: "DEWA",
    label: "Dewa",
    icon: Key,
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: Key,
  },
  {
    value: "OWNER",
    label: "Owner",
    icon: Key,
  },
  {
    value: "MANAGER",
    label: "Manager",
    icon: Key,
  },
  {
    value: "CASHIER",
    label: "Cashier",
    icon: Key,
  },
]
