import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { unstable_noStore } from "next/cache"
import { redirect } from "next/navigation"
import { BackButton } from "./back-button"
import { PendingOrderList } from "./pending-order-list"

export default async function PoolTableIdPage({
  params,
  searchParams,
}: {
  params: { poolTableId: Id<"poolTables"> }
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

  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    session.user.role ?? "",
  )
  const cashierAccessLevel = ["DEWA", "ADMIN", "CASHIER"].includes(
    session.user.role ?? "",
  )

  const orders = await fetchQuery(
    api.orders.findAllPendingStatusByPoolTableId,
    { poolTableId },
    { token: convexAuthNextjsToken() },
  )

  if (!!session.companySlug && !orders.length)
    redirect(`/${encodeURIComponent(session.companySlug)}/tables/`)

  return (
    <div>
      <BackButton />
      <PendingOrderList
        poolTableId={poolTableId}
        poolTableName={pool}
        isManager={managerAccessLevel}
        isCashier={cashierAccessLevel}
      />
    </div>
  )
}
