import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"

export default async function DewaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  noStore()
  const me = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!me) redirect("/signin")
  if (me.role !== "DEWA") redirect("/portal")

  return <>{children}</>
}
