"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { TransactionDatePicker } from "../transactions-date-picker"
import { columnsOrderline } from "./columns-orderline"
import { OrderlineTable } from "./orderline-table"

/**
 * Orderlines:
 * table
 * status payment
 * payment methods
 * total amount
 * discount
 * tax
 * createdBy
 * */

export function OrderlineTab() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })
  const orderlines = useTanstackQuery({
    ...convexQuery(api.orderlines.findAll, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
    }),
    enabled: !!date?.from && !!date.to,
    select(data) {
      return data.filter(
        (orderline) => orderline.order?.statusPayment !== "ARCHIVE",
      )
    },
  })

  return (
    <div className="relative">
      <TransactionDatePicker date={date} setDate={setDate} />
      {orderlines.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderlineTable data={orderlines.data} columns={columnsOrderline} />
      )}
    </div>
  )
}
