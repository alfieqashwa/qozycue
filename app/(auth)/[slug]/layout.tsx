import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { notFound, redirect } from "next/navigation"

export default async function SlugLayout({
  params,
  children,
}: Readonly<{
  params: { slug: string }
  children: React.ReactNode
}>) {
  const { slug } = params
  const token = await convexAuthNextjsToken()
  const preloadedSession = await preloadQuery(api.sessions.find, {}, { token })

  const session = await fetchQuery(api.sessions.find, {}, { token })

  if (!session) redirect("/signin")
  if (session.user?.role === "USER") redirect("/portal/")
  if (session.user.company?.slug !== slug) notFound()

  return (
    <WrapperDashboard
      linkList={DASHBOARD_LINK_LIST}
      preloadedSession={preloadedSession}
      className="text-primary size-9 shrink-0 animate-spin"
    >
      {children}
    </WrapperDashboard>
  )
}

/**
 ** Server-side authentication example
 ** source -> https://docs.convex.dev/client/react/nextjs/server-rendering
 */
