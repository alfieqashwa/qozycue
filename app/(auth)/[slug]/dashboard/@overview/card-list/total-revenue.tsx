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
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { Activity } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"

export function TotalRevenue({ date }: { date: DateRange | undefined }) {
  const [isIncludeTaxes, setIsIncludeTaxes] = useState(true)

  const { data: totalRevenue, status } = useQuery({
    ...convexQuery(api.orders._sumRevenue, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
    }),
    enabled: !!date?.from && !!date.to,
  })

  const revenueIncludeTaxes = formattedPriceWithRupiah.format(
    Number(totalRevenue?._sum.totalAmount),
  )
  const revenueExcludeTaxes = formattedPriceWithRupiah.format(
    Number(totalRevenue?._sum.revenue),
  )
  const totalTransactions = totalRevenue?._count

  if (status !== "success") return <SkeletonDashboardCard className="h-36" />
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibold tracking-wider">
          Total Revenue
        </CardTitle>
        <Button
          variant={"link"}
          size={"icon"}
          onClick={() => setIsIncludeTaxes((prev) => (prev = !prev))}
        >
          <Activity className="h-7 w-7 animate-pulse text-primary" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between text-2xl font-bold tracking-wide">
          {isIncludeTaxes ? revenueIncludeTaxes : revenueExcludeTaxes}
          <CardDescription className="text-xs font-medium">{`*${isIncludeTaxes ? "include" : "exclude"} taxes`}</CardDescription>
        </div>
        <p className="text-sm font-semibold tracking-wider text-muted-foreground">
          Total <span className="text-primary">{totalTransactions}</span>{" "}
          transactions
        </p>
      </CardContent>
    </Card>
  )
}
