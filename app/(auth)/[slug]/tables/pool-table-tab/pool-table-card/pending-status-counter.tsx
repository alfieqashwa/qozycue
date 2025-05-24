import { WrapperTooltip } from "@/components/wrapper-tooltip"
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
        convexQuery(api.companies.find, { id: companyId }),
        // enabled: Boolean(companyId), SHIT BUG
        /*
            if uncommented-out companyId, then the countPendingStatus will not show up whenever the table is not being used.
            But it still will show wheneever the table is starting. 
          */
      ],
    })

  return (
    <pre>
      {countStatus === "success" && !!countPendingStatus && (
        <WrapperTooltip
          content={`${countPendingStatus} Pending Payment`}
          side="left"
        >
          {company.status === "success" && !!company.data?.slug && (
            <Link
              href={{
                pathname: `/${encodeURIComponent(company.data?.slug as string)}/tables/${encodeURIComponent(poolTableId)}`,
                query: {
                  pool: poolTableName,
                },
              }}
              className="duration bg-primary/30 hover:bg-primary/50 absolute top-0 right-0 z-10 size-7 animate-pulse rounded-md rounded-tl-none rounded-tr-2xl rounded-br-none shadow-xl transition-opacity disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <span className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold capitalize">
                {/* {countPendingStatusp */}p
              </span>
            </Link>
          )}
        </WrapperTooltip>
      )}
    </pre>
  )
}
