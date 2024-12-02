import { ReactNode } from "react"

export default function SplashPageLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      {children}
    </div>
  )
}
