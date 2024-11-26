import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPrice, formattedPriceWithRupiah } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { GiMoneyStack } from "react-icons/gi"

export function TotalProfit({ date }: { date: DateRange | undefined }) {
  const [poolRentalRevenue, _calculateProfit] = useQueries({
    queries: [
      {
        ...convexQuery(api.poolRentals._sumRevenue, {
          from: date?.from?.getTime(),
          to: date?.to?.getTime(),
        }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.orderlines._calculateProfit, {
          from: date?.from?.getTime(),
          to: date?.to?.getTime(),
        }),
        enabled: !!date?.from && !!date.to,
      },
    ],
  })

  const totalOrderlineProfit = _calculateProfit.data?.reduce(
    (acc, curr) =>
      acc + curr.amount - (curr.product.costPrice ?? 0) * curr.quantity,
    0,
  )

  const totalProfit =
    (poolRentalRevenue.data?._sum.totalCost as number) +
    (totalOrderlineProfit as number)

  if (
    poolRentalRevenue.status !== "success" ||
    _calculateProfit.status !== "success"
  )
    return <SkeletonDashboardCard className="h-36" />
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibolda tracking-wider">
          Total Profit
        </CardTitle>
        <GiMoneyStack className="h-7 w-7 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wide">
          {formattedPriceWithRupiah.format(Number(totalProfit))}
        </div>
        <p className="text-sm font-semibold tracking-wider text-muted-foreground">
          Profit Cafe{" "}
          <span className="text-primary">
            {formattedPrice.format(Number(totalOrderlineProfit))}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
