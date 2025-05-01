import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { GiPoolTriangle } from "react-icons/gi"
import { type ListProps } from "../page"

export function PoolRevenue({ date, country }: ListProps) {
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

  const { locale, currency } = country

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-primary font-semibold tracking-wider">
          Pool Revenue
        </CardTitle>
        <GiPoolTriangle className="text-primary size-8" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wide">
          {formattedPriceBasedOnCountryCode(locale, currency).format(
            totalRevenue,
          )}
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Total duration{" "}
          <span className="text-primary">{durationHour.toFixed(2)}</span> hours
        </p>
      </CardContent>
    </Card>
  )
}
