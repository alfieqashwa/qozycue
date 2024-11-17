import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import Link from "next/link"

export function PendingStatusCounter({
  poolTableId,
  poolTableName,
}: {
  poolTableId: Id<"poolTables">
  poolTableName: string
}) {
  const session = useTanstackQuery({
    ...convexQuery(api.sessions.find, {}),
    select: (data) => ({ slug: data.companySlug }),
  })
  const { data: countPendingStatus, status } = useTanstackQuery({
    ...convexQuery(api.orders.countPendingStatus, { poolTableId }),
    enabled: Boolean(poolTableId),
  })

  return (
    <>
      {status === "success" && !!countPendingStatus && (
        <TooltipPendingNotification count={countPendingStatus}>
          {session.status === "success" && !!session.data.slug && (
            <Link
              href={{
                pathname: `/${encodeURIComponent(session.data.slug)}/tables/${encodeURIComponent(poolTableId)}`,
                query: {
                  pool: poolTableName,
                },
              }}
              className="duration absolute right-0 top-0 z-10 size-7 animate-pulse rounded-md rounded-br-none rounded-tl-none rounded-tr-2xl bg-primary/30 shadow-xl transition-opacity hover:bg-primary/50 disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold capitalize text-primary">
                {countPendingStatus}
              </span>
            </Link>
          )}
        </TooltipPendingNotification>
      )}
    </>
  )
}

const TooltipPendingNotification = ({
  count,
  children,
}: {
  count: number
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="left" className="bg-muted">
      <p className="space-x-1 font-sans text-xs font-medium text-muted-foreground">
        <span>{count}</span>
        <span>Pending Payment</span>
      </p>
    </TooltipContent>
  </Tooltip>
)
