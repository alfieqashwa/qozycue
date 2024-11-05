import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )
  if (!session._id) redirect("/signin")
  if (session.user.role === "MANAGER")
    redirect(`/${encodeURIComponent(session.companySlug!)}/transactions/`)
  if (session.user.role === "CASHIER")
    redirect(`/${encodeURIComponent(session.companySlug!)}/tables/`)

  return <>{children}</>
}
