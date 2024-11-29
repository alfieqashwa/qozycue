import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { PoolTableBarChartDashboard } from "./pool-table-bar-chart"

export function RevenueByPoolTable({
  from,
  to,
}: {
  from?: number
  to?: number
}) {
  const poolTables = useTanstackQuery(convexQuery(api.poolTables.findAll, {}))
  const groupPoolRentalByPoolTableId = useTanstackQuery({
    ...convexQuery(api.poolRentals._groupByPoolTableId, { from, to }),
    enabled: !!from && !!to && Boolean(poolTables.data),
    select(data) {
      return data
        .map((p) => ({
          name: `Table ${
            poolTables?.data?.find((pool) => pool._id === p.poolTableId)?.name
          }`,
          total: p._sum.totalCost,
          count: p._count,
        }))
        .filter((p) => !!p.name)
        .sort((p, q) =>
          p.name?.localeCompare(q.name, undefined, { numeric: true }),
        )
    },
  })

  const isLoading =
    poolTables.status !== "success" ||
    groupPoolRentalByPoolTableId.status !== "success"

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="absolute flex w-full flex-col space-y-1.5 p-6">
        <section className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h3 className="whitespace-nowrap font-semibold leading-none tracking-tight md:pl-20">
            Revenue By Pool Table
          </h3>
        </section>
      </div>

      {isLoading ? (
        <SkeletonDashboardCard className="h-[505px] sm:h-[455px]" />
      ) : (
        <Card className="col-span-4">
          <CardContent className="pt-44 sm:pl-6 sm:pt-20">
            <PoolTableBarChartDashboard
              data={groupPoolRentalByPoolTableId.data}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
