"use client"

import { CustomDatePicker } from "@/components/custom-date-picker"
import { addDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { CardList } from "./card-list"
import { ChartList } from "./chart-list"

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      <div className="space-y-4">
        <CardList date={date} />
        <ChartList date={date} />
      </div>
    </div>
  )
}
