import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { GiPoolTriangle } from "react-icons/gi"

export function PoolRevenue({ date }: { date: DateRange | undefined }) {
  const [
    { data: poolRentalRevenue, status: poolRentalRevenueStatus },
    { data: _sumByHourRate, status: _sumByHourRateStatus },
    { data: _sumByMinuteRate, status: _sumByMinuteRateStatus },
  ] = useTanstackQueries({
    queries: [
      {
        ...convexQuery(api.poolRentals._sumRevenue, {
          from: date?.from?.getTime(),
          to: date?.to?.getTime(),
        }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.poolRentals._sumByRate, {
          rate: "HOUR",
          from: date?.from?.getTime(),
          to: date?.to?.getTime(),
        }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.poolRentals._sumByRate, {
          rate: "MINUTE",
          from: date?.from?.getTime(),
          to: date?.to?.getTime(),
        }),
        enabled: !!date?.from && !!date.to,
      },
    ],
  })

  const sumByHourRate = _sumByHourRate?._sum.duration as number
  const sumByMinuteRate = _sumByMinuteRate?._sum.duration as number
  const totalDurationInHour = sumByHourRate + sumByMinuteRate / 60

  if (
    poolRentalRevenueStatus !== "success" ||
    _sumByHourRateStatus !== "success" ||
    _sumByMinuteRateStatus !== "success"
  )
    return <SkeletonDashboardCard className="h-36" />
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibold tracking-wider">
          Pool Revenue
        </CardTitle>
        <GiPoolTriangle className="h-7 w-7 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wide">
          {formattedPriceWithRupiah.format(
            Number(poolRentalRevenue?._sum.totalCost ?? 0),
          )}
        </div>
        <p className="text-sm font-semibold tracking-wider text-muted-foreground">
          Total duration{" "}
          <span className="text-primary">{totalDurationInHour.toFixed(2)}</span>{" "}
          hours
        </p>
      </CardContent>
    </Card>
  )
}
