import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import {
  formattedPrice,
  formattedPriceBasedOnCountryCode,
} from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries } from "@tanstack/react-query"
import { GiMoneyStack } from "react-icons/gi"
import { type ListProps } from ".."

export function TotalProfit({ date, country }: ListProps) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }

  const { locale, currency } = country

  const [poolRentalRevenue, _calculateProfit] = useQueries({
    queries: [
      {
        ...convexQuery(api.poolRentals._sumRevenue, { from, to }),
        enabled: !!date?.from && !!date.to,
      },
      {
        ...convexQuery(api.orderlines._calculateProfit, { from, to }),
        enabled: !!date?.from && !!date.to,
      },
    ],
  })

  /*
  ?? OLD CODE JUST FOR REFERENCE
  const totalOrderlineProfit = _calculateProfit.data?.reduce(
    (acc, curr) =>
      acc + curr.amount - (curr.product.costPrice ?? 0) * curr.quantity,
    0,
  )

  const totalProfit =
    (poolRentalRevenue.data?._sum.totalCost as number) +
    (totalOrderlineProfit as number)
  */

  // Calculate profit from orderlines
  const totalOrderlineProfit =
    (_calculateProfit.data?.totalAmount ?? 0) -
    (_calculateProfit.data?.totalCost ?? 0)

  // Calculate total profit (pool rentals + orderline profits)
  const totalProfit =
    (poolRentalRevenue.data?._sum.totalCost as number) + totalOrderlineProfit

  if (
    poolRentalRevenue.status !== "success" ||
    _calculateProfit.status !== "success"
  )
    return <SkeletonDashboardCard className="h-36" />
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-primary font-semibold tracking-wider">
          Total Profit
        </CardTitle>
        <GiMoneyStack className="text-primary size-8" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wide">
          {formattedPriceBasedOnCountryCode(
            locale,
            currency,
            Number(totalProfit),
          )}
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Profit Cafe{" "}
          <span className="text-foreground">
            {formattedPrice(locale, Number(totalOrderlineProfit))}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
