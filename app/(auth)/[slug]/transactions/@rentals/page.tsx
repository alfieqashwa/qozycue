"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsRental } from "./columns-rental"
import { RentalTable } from "./rental-table"

/**
 * Pool Rental:
 * table
 * packet
 * cost
 * duration
 * price
 * start
 * end
 * price to pay
 * */

export default function RentalPage() {
  const [date, setDate] = useDateRange()
  const { from, to } = { from: date?.from?.getTime(), to: date?.to?.getTime() }

  const poolRentals = useTanstackQuery({
    ...convexQuery(api.poolRentals.findAll, {
      from,
      to,
    }),
    enabled: !!from && !!to,
  })

  const company = useTanstackQuery(convexQuery(api.companies.find, {}))

  const country = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  )

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      {poolRentals.status !== "success" || !country ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <RentalTable
          data={poolRentals.data}
          columns={columnsRental(country.locale, country.currency)}
        />
      )}
    </div>
  )
}
