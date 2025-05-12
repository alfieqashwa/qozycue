import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Utensils } from "lucide-react"
import { type ListProps } from ".."

export function OrderlineRevenue({ date, country }: ListProps) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }

  const { data: orderlineRevenue, status } = useTanstackQuery({
    ...convexQuery(api.orderlines._sumRevenue, { from, to }),
    enabled: !!date?.from && !!date.to,
  })

  const { locale, currency } = country

  if (status !== "success") return <SkeletonDashboardCard className="h-36" />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-primary font-semibold tracking-wider">
          Cafe Revenue
        </CardTitle>
        <Utensils className="text-primary size-7" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wide">
          {formattedPriceBasedOnCountryCode(
            locale,
            currency,
            Number(orderlineRevenue._sum.amount),
          )}
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Total{" "}
          <span className="text-foreground">
            {orderlineRevenue._sum.quantity}
          </span>{" "}
          orders
        </p>
      </CardContent>
    </Card>
  )
}
