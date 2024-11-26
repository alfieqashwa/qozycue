"use client"

import { api } from "@/convex/_generated/api"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { CardList } from "./card-list"
import { ChartList } from "./chart-list"
import { OverviewDatePicker } from "./overview-date-picker"
import { convexQuery } from "@convex-dev/react-query"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const orders = useTanstackQuery({
    ...convexQuery(api.orders.findAllSortedByDate, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
      notEqual: "ARCHIVE",
    }),
    enabled: !!date?.from && !!date.to,
    select(data) {
      return data.filter((order) => order.statusPayment !== "ARCHIVE")
    },
  })
  return (
    <div className="">
      <OverviewDatePicker date={date} setDate={setDate} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <CardList />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartList />
      </div>
    </div>
  )
}
