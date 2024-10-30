import { DEWA_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"

export default async function DewaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  noStore()
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!session) redirect("/signin")
  if (session.user.role !== "DEWA") redirect("/portal")

  const preloadCompany = await preloadQuery(api.companies.find, {
    id: session.companyId,
  })

  return (
    <WrapperDashboard
      linkList={DEWA_LINK_LIST}
      session={session}
      preloadCompany={preloadCompany}
      className="size-9 shrink-0 animate-spin text-foreground"
    >
      {children}
    </WrapperDashboard>
  )
}
