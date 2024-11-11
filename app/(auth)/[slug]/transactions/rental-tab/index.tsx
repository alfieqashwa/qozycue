"use client"

import { StatusPayment } from "@prisma/client"
import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/trpc/react"
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

export function RentalTab() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const poolRentals = api.poolRental.findAllByCompanyId.useQuery(
    { from: date?.from, to: date?.to },
    {
      enabled: !!date?.from && !!date.to,
      select(data) {
        return data.filter(
          (rental) => rental.order?.statusPayment !== StatusPayment.ARCHIVE,
        )
      },
    },
  )

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
