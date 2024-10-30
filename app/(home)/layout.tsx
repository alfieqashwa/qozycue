import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReactNode } from "react"

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode
}) {
  return <main>{children}</main>
}
