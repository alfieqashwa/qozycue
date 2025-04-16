import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { notFound, redirect } from "next/navigation"

export default async function SlugLayout(
  props: Readonly<{
    params: Promise<{ slug: string }>
    children: React.ReactNode
  }>,
) {
  const params = props.params

  const { children } = props

  const { slug } = await params

  const preloadedSession = await preloadQuery(
    api.sessions.find,
    {},
    { token: await convexAuthNextjsToken() },
  )
  const session = preloadedQueryResult(preloadedSession)

  if (!session) redirect("/signin")
  if (session.user?.role === "USER") redirect("/portal/")
  if (session.user.company?.slug !== slug) notFound()

  return (
    <WrapperDashboard
      linkList={DASHBOARD_LINK_LIST}
      preloadedSession={preloadedSession}
      classNames="text-primary size-9 shrink-0 animate-spin-slow"
    >
      {children}
    </WrapperDashboard>
  )
}

/**
 ** Server-side authentication example
 ** source -> https://docs.convex.dev/client/react/nextjs/server-rendering
 */
