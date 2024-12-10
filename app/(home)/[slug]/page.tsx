import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { CompanySite } from "./company-site"

export default async function PublicSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  noStore()

  const { slug } = params
  const preloadedUser = await preloadQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )
  const company = await fetchQuery(api.companies.findPublicProcedure, { slug })
  if (!company) redirect("/")

  return <CompanySite slug={slug} preloadedUser={preloadedUser} />
}
