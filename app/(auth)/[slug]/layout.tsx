import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { notFound, redirect } from "next/navigation"

export default async function SlugLayout({
  params,
  children,
}: Readonly<{
  params: { slug: string }
  children: React.ReactNode
}>) {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )
  const company = await fetchQuery(
    api.companies.find,
    { id: session?.companyId },
    { token: convexAuthNextjsToken() },
  )

  if (!session._id) redirect("/signin")
  if (session.user?.role === "USER") redirect("/portal/")

  const { slug } = params
  if (company?.slug !== slug) notFound()

  return (
    <WrapperDashboard
      linkList={DASHBOARD_LINK_LIST}
      session={session}
      company={company}
      className="size-9 shrink-0 animate-spin text-primary"
    >
      {children}
    </WrapperDashboard>
  )
}

/**
 ** Server-side authentication example
 ** source -> https://docs.convex.dev/client/react/nextjs/server-rendering
 */
