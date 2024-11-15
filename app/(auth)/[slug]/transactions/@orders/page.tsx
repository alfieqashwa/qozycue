"use client"

import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { TransactionDatePicker } from "../transactions-date-picker"
import { columnsOrder } from "./columns-order"
import { OrderTable } from "./order-table"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"

export default function Page() {
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
    <div className="relative">
      <TransactionDatePicker date={date} setDate={setDate} />
      {orders.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderTable data={orders.data} columns={columnsOrder} />
      )}
    </div>
  )
}
