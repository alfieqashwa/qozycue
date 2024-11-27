"use client"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"

type TGroupByCategory = {
  name: string
  value: number
  fill: string
}
type PieChartDashboardProps = {
  chartData: TGroupByCategory[]
  chartConfig: ChartConfig
}

export function PieChartDashboard({
  chartData,
  chartConfig,
}: PieChartDashboardProps) {
  const totalProducts = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[375px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent className="min-w-[11rem] px-4 py-2 text-sm" />
          }
        />
        <Pie
          data={chartData}
          dataKey="value"
          name="Keyname"
          innerRadius={80}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-primary text-2xl font-bold"
                    >
                      {new Intl.NumberFormat("id-ID").format(totalProducts)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground text-sm font-medium"
                    >
                      Rupiahs
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
