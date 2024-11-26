import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { GiPoolTriangle } from "react-icons/gi"

export function PoolRevenue({ date }: { date: DateRange | undefined }) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }

  const [revenue, byHourRate, byMinuteRate] = useTanstackQueries({
    queries: [
      {
        ...convexQuery(api.poolRentals._sumRevenue, { from, to }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.poolRentals._sumByRate, { rate: "HOUR", from, to }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.poolRentals._sumByRate, {
          rate: "MINUTE",
          from,
          to,
        }),
        enabled: !!date?.from && !!date.to,
      },
    ],
  })

  if (
    revenue.status !== "success" ||
    byHourRate.status !== "success" ||
    byMinuteRate.status !== "success"
  )
    return <SkeletonDashboardCard className="h-36" />

  const totalRevenue = revenue.data?._sum.totalCost ?? 0
  const durationHour =
    (byHourRate.data._sum.duration ?? 0) +
    (byMinuteRate.data._sum.duration ?? 0)

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
          {formattedPriceWithRupiah.format(totalRevenue)}
        </div>
        <p className="text-sm font-semibold tracking-wider text-muted-foreground">
          Total duration{" "}
          <span className="text-primary">{durationHour.toFixed(2)}</span> hours
        </p>
      </CardContent>
    </Card>
  )
}
