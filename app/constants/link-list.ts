"use client"

import {
  Archive,
  BookOpenText,
  GaugeCircle,
  PackageSearch,
  Settings,
  ShoppingCart,
  Store,
  type LucideIcon,
} from "lucide-react"

export const DASHBOARD_LINK_LIST = [
  {
    title: "dashboard",
    href: "/dashboard",
    icon: GaugeCircle,
    isGeneral: true,
  },
  {
    title: "tables",
    href: "/tables",
    icon: Store,
    isGeneral: true,
  },
  {
    title: "transactions",
    href: "/transactions",
    icon: ShoppingCart,
    isGeneral: true,
  },
  {
    title: "archives",
    icon: Archive,
    href: "/archives",
    isGeneral: false,
  },
  {
    title: "products",
    href: "/products",
    icon: PackageSearch,
    isGeneral: false,
  },
  {
    title: "settings",
    href: "/settings",
    icon: Settings,
    isGeneral: false,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: BookOpenText,
    isGeneral: false,
  },
]

export const ZENITH_LINK_LIST = [
  {
    title: "zenith",
    href: "/zenith",
    icon: GaugeCircle,
    isGeneral: true,
  },
  {
    title: "companies",
    href: "/zenith/companies",
    icon: Store,
    isGeneral: true,
  },
  {
    title: "transactions",
    href: "/zenith/transactions",
    icon: ShoppingCart,
    isGeneral: true,
  },
]

export type TLinkList = {
  title: string
  href: string
  icon: LucideIcon
  isGeneral?: boolean
}
