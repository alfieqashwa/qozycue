import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { GiPoolTriangle } from "react-icons/gi"
import { type ListProps } from ".."

export function PoolRevenue({ date, country }: ListProps) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }

  const isEnabled = !!from && !!to

  const revenue = useTanstackQuery({
    ...convexQuery(api.poolRentals._sumRevenue, { from, to }),
    enabled: isEnabled,
  })

  const byHourRate = useTanstackQuery({
    ...convexQuery(api.poolRentals._sumByRate, { rate: "HOUR", from, to }),
    enabled: isEnabled,
  })

  const byMinuteRate = useTanstackQuery({
    ...convexQuery(api.poolRentals._sumByRate, { rate: "MINUTE", from, to }),
    enabled: isEnabled,
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
          {formattedPriceBasedOnCountryCode(locale, currency, totalRevenue)}
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Total duration{" "}
          <span className="text-foreground">{durationHour.toFixed(2)}</span>{" "}
          <span>{durationHour > 1 ? "hours" : "hour"}</span>
        </p>
      </CardContent>
    </Card>
  )
}
