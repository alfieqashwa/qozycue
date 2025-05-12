import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { TopTenProductBarChart } from "./top-ten-product-bar-chart"

export default function RevenueByTopTenProducts({
  from,
  to,
  country,
}: {
  from?: number
  to?: number
  country: ICountry
}) {
  const products = useTanstackQuery(convexQuery(api.products.findAll, {}))

  const groupByProductId = useTanstackQuery({
    ...convexQuery(api.orderlines._groupByProductId, { from, to }),
    enabled: !!from && !!to && Boolean(products.data),
    select(data) {
      return data
        .map((p) => ({
          name: products.data?.find((f) => f._id === p.productId)
            ?.name as string,
          total: p._sum.amount as number,
          qty: p._sum.quantity as number,
        }))
        .sort((a, b) => b.total - a.total)
        .filter((_, i) => i < 10)
    },
  })

  const isLoading =
    products.status !== "success" || groupByProductId.status !== "success"

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="absolute flex w-full flex-col space-y-1.5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between md:pl-20">
          <article className="space-y-2">
            <h3 className="leading-none font-semibold tracking-tight whitespace-nowrap">
              Revenue By Product
            </h3>
            <p className="text-muted-foreground text-sm font-semibold">
              Top 10 of Products
            </p>
          </article>
        </div>
      </div>
      {isLoading ? (
        <SkeletonDashboardCard className="h-[505px] sm:h-[455px]" />
      ) : (
        <Card className="col-span-4">
          <CardContent className="pt-40 sm:pt-20 sm:pl-6">
            <TopTenProductBarChart
              data={groupByProductId.data}
              country={country}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
