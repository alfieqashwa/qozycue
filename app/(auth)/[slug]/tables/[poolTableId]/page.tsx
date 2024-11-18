import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { unstable_noStore } from "next/cache"
import { redirect } from "next/navigation"

export default async function PoolTableIdPage({
  params,
  searchParams,
}: {
  params: { poolTableId: string }
  searchParams: { pool: string }
}) {
  unstable_noStore()
  const { poolTableId } = params
  const { pool } = searchParams

  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!session._id) redirect("/signin")

  return (
    <div>
      <h2>PoolTableID: {poolTableId}</h2>
      <h2>Pool: {pool}</h2>
    </div>
  )
}
