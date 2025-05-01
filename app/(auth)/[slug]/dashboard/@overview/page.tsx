"use client"

import { CustomDatePicker } from "@/components/custom-date-picker"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { CardList } from "./card-list"
import { ChartList } from "./chart-list"

export type ListProps = {
  date: DateRange | undefined
  country: ICountry
}

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })
  const { data, status } = useTanstackQuery({
    ...convexQuery(api.companies.find, {}),
  })

  const country = countries.find((c) => c.code === data?.countryCode)

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      {status === "success" && (
        <div className="space-y-4">
          <CardList date={date} country={country as ICountry} />
          <ChartList date={date} country={country as ICountry} />
        </div>
      )}
    </div>
  )
}
