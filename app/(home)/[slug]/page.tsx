import { unstable_noStore as noStore } from "next/cache"

export default async function PublicSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  noStore()

  const { slug } = params
  // const company = await api.company.findPublic({ slug })
  // if (!company) redirect("/")

  // const session = await getServerAuthSession()

  // return <CompanySite slug={slug} session={session} />
  return (
    <div>
      <h2>Company Public Site</h2>
    </div>
  )
}
