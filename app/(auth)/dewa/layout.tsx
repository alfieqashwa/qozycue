import { DEWA_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { redirect } from "next/navigation"

export default async function DewaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await convexAuthNextjsToken()
  const session = await fetchQuery(api.sessions.find, {}, { token })

  if (!session) redirect("/signin")

  if (session.user.role !== "DEWA") redirect("/portal/")

  return (
    <WrapperDashboard
      linkList={DEWA_LINK_LIST}
      user={session.user}
      className="size-9 shrink-0 animate-spin text-foreground"
    >
      {children}
    </WrapperDashboard>
  )
}
