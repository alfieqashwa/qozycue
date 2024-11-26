import { DateRange } from "react-day-picker"
import { TotalRevenue } from "./total-revenue"

type Props = {
  date: DateRange | undefined
}
export function CardList({ date }: Props) {
  return (
    <>
      <TotalRevenue date={date} />
    </>
  )
}
