import { PaymentMethod, StatusPayment } from "@/types"
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
  value?: string
  label: string
  icon: LucideIcon
}

export const statusEnabled = [
  {
    value: "enabled",
    label: "Enabled",
    icon: PackageCheck,
  },
  {
    value: "disabled",
    label: "Disabled",
    icon: PackageX,
  },
]

export const packetRates = [
  {
    value: "HOUR",
    label: "HOUR",
    icon: Hourglass,
  },
  {
    value: "MINUTE",
    label: "MINUTE",
    icon: Timer,
  },
] as unknown as Options[]

export const statusPayments = [
  { value: "OPEN", label: "Open", icon: Disc2 },
  { value: "PENDING", label: "Pending", icon: Disc2 },
  { value: "PAID", label: "Paid", icon: Disc2 },
]

export const paymentMethods = [
  {
    value: "CASH",
    label: "Cash",
    icon: Banknote,
  },
  {
    value: "CREDIT",
    label: "Credit",
    icon: CreditCard,
  },
  {
    value: "DEBIT",
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
