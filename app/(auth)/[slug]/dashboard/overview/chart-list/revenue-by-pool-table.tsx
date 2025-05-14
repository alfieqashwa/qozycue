import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { PoolTableBarChartDashboard } from "./pool-table-bar-chart"

export function RevenueByPoolTable({
  from,
  to,
  country,
}: {
  from?: number
  to?: number
  country: ICountry
}) {
  const { data: groupPoolRentalByPoolTableId, status } = useTanstackQuery(
    convexQuery(api.poolRentals._groupByPoolTableId, { from, to }),
  )

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="absolute flex w-full flex-col space-y-1.5 p-6">
        <section className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h3 className="leading-none font-semibold tracking-tight whitespace-nowrap md:pl-20">
            Revenue By Pool Table
          </h3>
        </section>
      </div>

      {status !== "success" ? (
        <SkeletonDashboardCard className="h-[505px] sm:h-[455px]" />
      ) : (
        <Card className="col-span-4">
          <CardContent className="pt-44 sm:pt-20 sm:pl-6">
            <PoolTableBarChartDashboard
              data={groupPoolRentalByPoolTableId}
              country={country}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
