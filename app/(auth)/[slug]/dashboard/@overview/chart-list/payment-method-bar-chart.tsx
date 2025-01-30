"use client"

import { formattedPrice, formattedPriceWithRupiah } from "@/lib/format-price"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

interface ChartProps<TData> {
  data: TData[]
  // name?: string
  colorBar?: string
}

/**
 * source: https://github.com/recharts/recharts/issues/3615
 */

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return
  error(...args)
}

/**
 * Types for CustomTooltip Props
 * source: https://stackoverflow.com/questions/65913461/typescript-interface-for-recharts-custom-tooltip
 */
function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  return active && !!payload && !!payload.length ? (
    <div className="rounded-lg border border-muted-foreground bg-card p-4 shadow-md">
      <article className="flex flex-col space-y-1 text-sm font-semibold text-foreground">
        <p className="capitalize text-primary">{label}</p>
        <p>{formattedPriceWithRupiah.format(Number(payload[0]?.value))}</p>
        <p className="text-xs text-muted-foreground">
          {`${payload[1]?.value as number} ${(payload[1]?.value as number) > 1 ? "transactions" : "transaction"}`}
        </p>
      </article>
    </div>
  ) : null
}

export function PaymentMethodBarChartDashboard<TData>({
  data,
  colorBar = "fill-primary",
}: ChartProps<TData>) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          className="truncate font-semibold capitalize"
        />
        <YAxis
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${formattedPrice.format(Number(value))}`}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Bar
          dataKey="total"
          stackId="a"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className={colorBar}
        />
        <Bar
          dataKey="count"
          stackId="a"
          fill="currentColor"
          className="fill-secondary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]
