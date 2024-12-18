import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { redirect } from "next/navigation"
import { CompanySite } from "./company-site"

export default async function PublicSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params

  const company = await fetchQuery(api.companies.findPublicProcedure, { slug })
  if (!company) redirect("/")

  const preloadedUser = await preloadQuery(
    api.users.me,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return <CompanySite slug={slug} preloadedUser={preloadedUser} />
}
