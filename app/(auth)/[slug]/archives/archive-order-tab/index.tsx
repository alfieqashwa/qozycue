"use client"

import { CustomDatePicker } from "@/components/custom-date-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { columnsArchiveOrder } from "./columns-archive-order"
import { OrderTable } from "./order-table"

export function ArchiveOrderTab({
  disabledBasedOnAccessLevel,
}: {
  disabledBasedOnAccessLevel: boolean
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const orders = useTanstackQuery({
    ...convexQuery(api.orders.findAllArchiveOrderSortedByDate, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
      equal: "ARCHIVE",
    }),
    enabled: !!date?.from && !!date.to,
  })

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />

      {orders.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderTable
          data={orders.data}
          columns={columnsArchiveOrder}
          disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
        />
      )}
    </div>
  )
}
