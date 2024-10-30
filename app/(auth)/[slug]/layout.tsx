import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import { WrapperDashboard } from "@/components/wrapper-dashboard"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
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

  const { slug } = params

  if (!session) redirect("/signin")

  if (session.user.role === "USER") redirect("/portal")

  if (session.companySlug && slug !== session.companySlug) notFound()

  const preloadCompany = await preloadQuery(api.companies.find, {
    id: session.companyId,
  })

  const poolTableList = await fetchQuery(api.pooltables.findAllByCompanyId, {
    companyId: session.companyId!,
  })

  return (
    <WrapperDashboard
      linkList={DASHBOARD_LINK_LIST}
      session={session}
      preloadCompany={preloadCompany}
      poolTableList={poolTableList}
      className="size-9 shrink-0 animate-spin text-primary"
    >
      {children}
    </WrapperDashboard>
  )
}

/**
 ** Server-side authentication example
source -> https://docs.convex.dev/client/react/nextjs/server-rendering

import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Tasks } from "./Tasks";

export async function TasksWrapper() {
  const token = await getAuthToken();
  const preloadedTasks = await preloadQuery(
    api.tasks.list,
    { list: "default" },
    { token },
  );
  return <Tasks preloadedTasks={preloadedTasks} />;
}
 */
