import { DEWA_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { redirect } from "next/navigation"

export default async function DewaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await convexAuthNextjsToken()
  const preloadedSession = await preloadQuery(api.sessions.find, {}, { token })
  const session = preloadedQueryResult(preloadedSession)

  if (!session) redirect("/signin")
  if (session.user.role !== "DEWA") redirect("/portal/")

  return (
    <WrapperDashboard
      linkList={DEWA_LINK_LIST}
      preloadedSession={preloadedSession}
      className="size-9 shrink-0 animate-spin text-foreground"
    >
      {children}
    </WrapperDashboard>
  )
}
