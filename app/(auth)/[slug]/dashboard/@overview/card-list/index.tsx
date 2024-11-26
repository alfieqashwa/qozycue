import { DateRange } from "react-day-picker"
import { PoolRevenue } from "./pool-revenue"
import { TotalRevenue } from "./total-revenue"

type Props = {
  date: DateRange | undefined
}
export function CardList({ date }: Props) {
  return (
    <>
      <TotalRevenue date={date} />
      <PoolRevenue date={date} />
    </>
  )
}
