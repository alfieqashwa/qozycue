"use client"

import { addDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { CardList } from "./card-list"
import { ChartList } from "./chart-list"
import { OverviewDatePicker } from "./overview-date-picker"

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  return (
    <div className="space-y-4">
      <OverviewDatePicker date={date} setDate={setDate} />
      <CardList date={date} />
      <ChartList date={date} />
    </div>
  )
}
