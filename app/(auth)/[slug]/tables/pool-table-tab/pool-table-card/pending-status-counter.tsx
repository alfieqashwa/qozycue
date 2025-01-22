import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import Link from "next/link"

export function PendingStatusCounter({
  poolTableId,
  poolTableName,
  companyId,
}: {
  poolTableId: Id<"poolTables">
  poolTableName: string
  companyId: Id<"companies"> | undefined
}) {
  const [{ data: countPendingStatus, status: countStatus }, company] =
    useTanstackQueries({
      queries: [
        {
          ...convexQuery(api.orders.countPendingStatus, { poolTableId }),
          enabled: !!poolTableId,
        },
        {
          ...convexQuery(api.companies.find, { id: companyId }),
          // enabled: Boolean(companyId), SHIT BUG
          /*
            if uncommented-out companyId, then the countPendingStatus will not show up whenever the table is not being used.
            But it still will show wheneever the table is starting. 
          */
        },
      ],
    })

  return (
    <pre>
      {countStatus === "success" && !!countPendingStatus && (
        <TooltipPendingNotification count={countPendingStatus}>
          {company.status === "success" && !!company.data?.slug && (
            <Link
              href={{
                pathname: `/${encodeURIComponent(company.data?.slug as string)}/tables/${encodeURIComponent(poolTableId)}`,
                query: {
                  pool: poolTableName,
                },
              }}
              className="duration absolute right-0 top-0 z-10 size-7 animate-pulse rounded-md rounded-br-none rounded-tl-none rounded-tr-2xl bg-primary/30 shadow-xl transition-opacity hover:bg-primary/50 disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold capitalize text-primary">
                {/* {countPendingStatusp */}p
              </span>
            </Link>
          )}
        </TooltipPendingNotification>
      )}
    </pre>
  )
}

const TooltipPendingNotification = ({
  count,
  children,
}: {
  count: number
  children: React.ReactNode
}) => {
  return (
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
}
