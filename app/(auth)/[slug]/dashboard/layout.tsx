import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  params,
  children,
}: Readonly<{ params: { slug: string }; children: React.ReactNode }>) {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!session) redirect("/signin")
  if (["USER", "MANAGER", "CASHIER"].includes(session.user.role ?? "")) {
    redirect("/portal")
  }
  const { slug } = params
  if (slug !== session.companySlug) notFound()

  return (
    // <WrapperDashboard
    //   linkList={DASHBOARD_LINK_LIST}
    //   className="size-9 shrink-0 animate-spin text-primary"
    // >
    //   {children}
    // </WrapperDashboard>
    <>{children}</>
  )
}
