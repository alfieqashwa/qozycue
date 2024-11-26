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
    <div className="relative">
      <OverviewDatePicker date={date} setDate={setDate} />
      <CardList date={date} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartList />
      </div>
    </div>
  )
}
