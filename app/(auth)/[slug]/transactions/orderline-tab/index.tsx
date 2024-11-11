"use client"

import { StatusPayment } from "@prisma/client"
import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/trpc/react"
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
  const orderlines = api.orderline.findAllByCompanyId.useQuery(
    { from: date?.from, to: date?.to },
    {
      enabled: !!date?.from && !!date.to,
      select(data) {
        return data.filter(
          (orderline) =>
            orderline.order?.statusPayment !== StatusPayment.ARCHIVE,
        )
      },
    },
  )

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
