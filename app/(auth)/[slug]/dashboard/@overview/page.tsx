"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { countryCodeSchema, type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { DateRange } from "react-day-picker"
import { CardList } from "./card-list"
import { ChartList } from "./chart-list"

export type ListProps = {
  date: DateRange | undefined
  country: ICountry
}

export default function DashboardPage() {
  const [date, setDate] = useDateRange()

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.companies.find, {}),
  })

  const countryCodeParse = countryCodeSchema.safeParse(data?.countryCode)
  const country = countryCodeParse.success
    ? countries.find((c) => c.code === countryCodeParse.data)
    : undefined

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      {status === "success" && !!country && (
        <div className="space-y-4">
          <CardList date={date} country={country} />
          <ChartList date={date} country={country} />
        </div>
      )}
    </div>
  )
}
