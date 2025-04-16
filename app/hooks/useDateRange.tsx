import { endOfDay, startOfDay, subMonths } from "date-fns"
import { Dispatch, SetStateAction, useState } from "react"
import { DateRange } from "react-day-picker"

export function useDateRange(): [
  DateRange | undefined,
  Dispatch<SetStateAction<DateRange | undefined>>,
] {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subMonths(new Date(), 1)),
    to: endOfDay(new Date()),
  })

  return [dateRange, setDateRange]
}
