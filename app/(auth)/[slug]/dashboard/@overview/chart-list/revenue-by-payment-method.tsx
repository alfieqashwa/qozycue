import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { BarChartDashboard } from "./bar-chart"

export function RevenueByPaymentMethod({
  from,
  to,
}: {
  from?: number
  to?: number
}) {
  const { data: groupByPaymentMethod, status } = useTanstackQuery({
    ...convexQuery(api.orders._groupByPaymentMethod, {
      from,
      to,
    }),
    enabled: !!from && !!to,
  })

  if (status !== "success")
    return <SkeletonDashboardCard className="h-[28.85rem]" />
  const dataGroupByPaymentMethod = groupByPaymentMethod?.map((order) => ({
    name: order.paymentMethod,
    total: order._sum.totalAmount,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Revenue By Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:pl-6">
        <BarChartDashboard data={dataGroupByPaymentMethod} />
        {/* <pre>{JSON.stringify(groupByPaymentMethod)}</pre> */}
      </CardContent>
    </Card>
  )
}
