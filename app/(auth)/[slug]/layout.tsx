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
  const me = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!me) redirect("/signin")
  if (me.role === "USER") redirect("/portal")

  const companySlug = await fetchQuery(
    api.companies.slug,
    {},
    { token: convexAuthNextjsToken() },
  )
  const { slug } = params
  if (companySlug && slug !== companySlug) notFound()

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
