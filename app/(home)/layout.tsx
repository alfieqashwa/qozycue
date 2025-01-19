import { Copyright } from "@/components/copyright"
import { ReactNode } from "react"

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative">
      <main className="flex min-h-screen flex-col items-center justify-center">
        {children}
      </main>
      <Copyright />
    </div>
  )
}
