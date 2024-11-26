import { DateRange } from "react-day-picker"
import { OrderlineRevenue } from "./orderline-revenue"
import { PoolRevenue } from "./pool-revenue"
import { TotalProfit } from "./total-profit"
import { TotalRevenue } from "./total-revenue"

type Props = {
  date: DateRange | undefined
}
export function CardList({ date }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <TotalRevenue date={date} />
      <PoolRevenue date={date} />
      <OrderlineRevenue date={date} />
      <TotalProfit date={date} />
    </div>
  )
}
