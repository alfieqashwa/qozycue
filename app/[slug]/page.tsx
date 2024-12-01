import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"
import { CompanySite } from "./company-site"

export default async function PublicSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  noStore()

  const { slug } = params
  const company = await api.company.findPublic({ slug })
  if (!company) redirect("/")

  const session = await getServerAuthSession()

  return <CompanySite slug={slug} session={session} />
}
