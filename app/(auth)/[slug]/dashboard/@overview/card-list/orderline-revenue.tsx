import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Utensils } from "lucide-react"
import { DateRange } from "react-day-picker"

export function OrderlineRevenue({ date }: { date: DateRange | undefined }) {
  const { data: orderlineRevenue, status } = useTanstackQuery({
    ...convexQuery(api.orderlines._sumRevenue, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
    }),
    enabled: !!date?.from && !!date.to,
  })
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
          {formattedPriceWithRupiah.format(
            Number(orderlineRevenue._sum.amount),
          )}
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Total{" "}
          <span className="text-primary">{orderlineRevenue._sum.quantity}</span>{" "}
          orders
        </p>
      </CardContent>
    </Card>
  )
}
