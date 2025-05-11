import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig } from "@/components/ui/chart"
import { api } from "@/convex/_generated/api"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { PieChartDashboard } from "./pie-chart"

export type TGroupByCategory = {
  name: string
  value: number
  qty: number
  fill: string
}

export function RevenueByProductCategory({
  from,
  to,
  country,
}: {
  from?: number
  to?: number
  country: ICountry
}) {
  const [sumByFood, sumByDrink, sumByOthers] = useTanstackQueries({
    queries: [
      {
        ...convexQuery(api.orderlines._sumByCategory, {
          categoryName: "food",
          from,
          to,
        }),
        enabled: !!from && !!to,
      },
      {
        ...convexQuery(api.orderlines._sumByCategory, {
          categoryName: "drink",
          from,
          to,
        }),
        enabled: !!from && !!to,
      },
      {
        ...convexQuery(api.orderlines._sumByCategory, {
          categoryName: "others",
          from,
          to,
        }),
        enabled: !!from && !!to,
      },
    ],
  })

  if (
    sumByFood.status !== "success" ||
    sumByDrink.status !== "success" ||
    sumByOthers.status !== "success"
  )
    return <SkeletonDashboardCard className="h-[28.85rem]" />

  const dataGroupByCategory: TGroupByCategory[] = [
    {
      name: "food",
      value: sumByFood.data?._sum.amount as number,
      qty: sumByFood.data._sum.quantity as number,
      fill: "var(--color-food)",
    },
    {
      name: "drink",
      value: sumByDrink.data?._sum.amount as number,
      qty: sumByDrink.data._sum.quantity as number,
      fill: "var(--color-drink)",
    },
    {
      name: "others",
      value: sumByOthers.data?._sum.amount as number,
      qty: sumByOthers.data._sum.quantity as number,
      fill: "var(--color-others)",
    },
  ] as const

  const chartConfig = {
    food: {
      label: "Food",
      color: "rgb(110 231 183)", // emerald-300
    },
    drink: {
      label: "Drink",
      color: "rgb(240 171 252)", // fuchsia-300
    },
    others: {
      label: "Others",
      color: "rgb(217 249 157)", // lime-200
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue By Product Category</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <PieChartDashboard
          chartData={dataGroupByCategory}
          chartConfig={chartConfig}
          country={country}
        />
      </CardContent>
      <CardFooter className="text-primary mx-auto text-sm font-medium">
        Showing total Products{" "}
        <TrendingUp className="ml-2 inline-block h-4 w-4" />
      </CardFooter>
    </Card>
  )
}
