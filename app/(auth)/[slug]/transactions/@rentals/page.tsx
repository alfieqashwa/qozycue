"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { TransactionDatePicker } from "../transactions-date-picker"
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const poolRentals = useTanstackQuery({
    ...convexQuery(api.poolrentals.findAll, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
    }),
    enabled: !!date?.from && !!date.to,
    select(data) {
      return data.filter((rental) => rental.order?.statusPayment !== "ARCHIVE")
    },
  })

  return (
    <div className="relative">
      <TransactionDatePicker date={date} setDate={setDate} />
      {poolRentals.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <RentalTable data={poolRentals.data} columns={columnsRental} />
      )}
    </div>
  )
}
