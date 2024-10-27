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
    console.log({ company })

    if (!!company) {
      if (viewer.role === "DEWA") redirect("/dewa")
      if (viewer.role === "ADMIN" || viewer.role === "OWNER")
        redirect(`/${encodeURIComponent(company.slug)}/dashboard/`)
      if (viewer.role === "MANAGER")
        redirect(`/${encodeURIComponent(company.slug)}/transactions`)
      if (viewer.role === "CASHIER")
        redirect(`${encodeURIComponent(company.slug)}/tables`)

      if (viewer.role === "USER")
        redirect(`${encodeURIComponent(company.slug)}/portal`)
    }
  }
  return <>{children}</>
}
