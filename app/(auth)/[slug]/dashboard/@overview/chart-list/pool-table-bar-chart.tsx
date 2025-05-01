"use client"

import {
  formattedPrice,
  formattedPriceBasedOnCountryCode,
} from "@/lib/format-price"
import { type ICountry } from "@/types"
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
  data?: TData[]
  // name?: string
  colorBar?: string
  country: ICountry
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
  locale,
  currency,
}: TooltipProps<ValueType, NameType> & {
  locale: string
  currency: string
}) {
  return active && !!payload && !!payload.length ? (
    <div className="border-muted-foreground bg-card rounded-lg border p-4 shadow-md">
      <article className="text-foreground flex flex-col space-y-1 text-sm font-semibold">
        <p className="text-primary">{label}</p>
        <p>
          {formattedPriceBasedOnCountryCode(locale, currency).format(
            Number(payload[0]?.value),
          )}
        </p>
        <p className="text-muted-foreground text-xs">
          {`${payload[1]?.value as number} ${(payload[1]?.value as number) > 1 ? "transactions" : "transaction"}`}
        </p>
      </article>
    </div>
  ) : null
}

export function PoolTableBarChartDashboard<TData>({
  data,
  colorBar = "fill-primary",
  country,
}: ChartProps<TData>) {
  const { locale, currency } = country

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
          tickFormatter={(value) =>
            `${formattedPrice(locale).format(Number(value))}`
          }
        />
        <Tooltip
          cursor={false}
          content={<CustomTooltip locale={locale} currency={currency} />}
        />
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
