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

  const user = await fetchQuery(
    api.users.me,
    {},
    { token: await convexAuthNextjsToken() },
  )

  if (!user) redirect("/signin")

  const company = await fetchQuery(
    api.companies.find,
    { id: user.companyId },
    { token: await convexAuthNextjsToken() },
  )

  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    user.role ?? "",
  )
  const cashierAccessLevel = ["DEWA", "ADMIN", "CASHIER"].includes(
    user.role ?? "",
  )

  const orders = await fetchQuery(
    api.orders.findAllPendingStatusByPoolTableId,
    { poolTableId },
    { token: await convexAuthNextjsToken() },
  )

  if (!orders.length)
    redirect(`/${encodeURIComponent(company?.slug as string)}/tables/`)

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
