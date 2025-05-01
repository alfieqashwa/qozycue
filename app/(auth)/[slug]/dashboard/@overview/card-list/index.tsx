import { ListProps } from "../page"
import { OrderlineRevenue } from "./orderline-revenue"
import { PoolRevenue } from "./pool-revenue"
import { TotalProfit } from "./total-profit"
import { TotalRevenue } from "./total-revenue"

export function CardList({ date, country }: ListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <TotalRevenue date={date} country={country} />
      <PoolRevenue date={date} country={country} />
      <OrderlineRevenue date={date} country={country} />
      <TotalProfit date={date} country={country} />
    </div>
  )
}
