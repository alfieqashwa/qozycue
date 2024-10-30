import { ReactNode } from "react"

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode
}) {
  return <main>{children}</main>
}
