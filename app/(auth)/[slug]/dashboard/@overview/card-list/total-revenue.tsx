import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Activity } from "lucide-react"
import { useState } from "react"
import { type ListProps } from "../page"

export function TotalRevenue({ date, country }: ListProps) {
  const [isIncludeTaxes, setIsIncludeTaxes] = useState(true)

  const { data: totalRevenue, status } = useTanstackQuery({
    ...convexQuery(api.orders._sumRevenue, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
    }),
    enabled: !!date?.from && !!date.to,
  })
  const { locale, currency } = country
  const revenueIncludeTaxes = formattedPriceBasedOnCountryCode(
    locale,
    currency,
  ).format(Number(totalRevenue?._sum.totalAmount))
  const revenueExcludeTaxes = formattedPriceBasedOnCountryCode(
    locale,
    currency,
  ).format(Number(totalRevenue?._sum.revenue))
  const totalTransactions = totalRevenue?._count

  if (status !== "success") return <SkeletonDashboardCard className="h-36" />
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-primary font-semibold tracking-wider">
          Total Revenue
        </CardTitle>
        <Button
          variant={"link"}
          size={"icon"}
          onClick={() => setIsIncludeTaxes((prev) => (prev = !prev))}
        >
          <Activity className="text-primary size-7 animate-pulse" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between text-2xl font-bold tracking-wide">
          {isIncludeTaxes ? revenueIncludeTaxes : revenueExcludeTaxes}
          <CardDescription className="text-xs font-medium">{`*${isIncludeTaxes ? "include" : "exclude"} taxes`}</CardDescription>
        </div>
        <p className="text-muted-foreground pt-1 text-sm font-semibold tracking-wider">
          Total <span className="text-primary">{totalTransactions}</span>{" "}
          transactions
        </p>
      </CardContent>
    </Card>
  )
}
