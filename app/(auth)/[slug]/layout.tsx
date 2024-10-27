import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!viewer) redirect("/signin")
  if (!!viewer?.companyId) {
    const company = await fetchQuery(api.companies.find, {
      companyId: viewer.companyId,
    })

    if (!!company) {
      if (viewer.role === "DEWA") redirect("/dewa/")
      if (viewer.role === "ADMIN" || viewer.role === "OWNER")
        redirect(`/${encodeURIComponent(company.slug)}/dashboard/`)
      if (viewer.role === "MANAGER")
        redirect(`/${encodeURIComponent(company.slug)}/transactions/`)
      if (viewer.role === "CASHIER")
        redirect(`${encodeURIComponent(company.slug)}/tables/`)

      if (viewer.role === "USER")
        redirect(`${encodeURIComponent(company.slug)}/portal/`)
    }
  }
  return <>{children}</>
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
