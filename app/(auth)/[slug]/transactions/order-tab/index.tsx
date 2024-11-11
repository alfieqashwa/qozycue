"use client"

import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { TransactionDatePicker } from "../transactions-date-picker"
import { columnsOrder } from "./columns-order"
import { OrderTable } from "./order-table"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"

/**
 * Orders:
 * table
 * status payment
 * payment methods
 * total amount
 * discount
 * tax
 * createdBy
 * */

export function OrderTab({
  disabledBasedOnAccessLevel,
}: {
  disabledBasedOnAccessLevel: boolean
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const orders = api.order.findAllByCompanyIdSortedByDate.useQuery(
    { from: date?.from, to: date?.to, notIn: ["ARCHIVE"] },
    { enabled: !!date?.from && !!date.to },
  )

  return (
    <div className="relative">
      <TransactionDatePicker date={date} setDate={setDate} />
      {orders.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderTable
          data={orders.data}
          columns={columnsOrder}
          disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
        />
      )}
    </div>
  )
}
