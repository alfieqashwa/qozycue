import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { notFound, redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"

export default async function SlugLayout({
  params,
  children,
}: Readonly<{
  params: { slug: string }
  children: React.ReactNode
}>) {
  noStore()
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )
  if (!user) redirect("/signin")

  const company = await fetchQuery(
    api.companies.find,
    { id: user?.companyId },
    { token: convexAuthNextjsToken() },
  )

  if (user?.role === "USER") redirect("/portal/")

  const { slug } = params
  if (company?.slug !== slug) notFound()

  return (
    <WrapperDashboard
      linkList={DASHBOARD_LINK_LIST}
      user={user}
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
