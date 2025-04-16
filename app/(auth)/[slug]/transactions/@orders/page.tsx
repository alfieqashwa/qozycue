"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsOrder } from "./columns-order"
import { OrderTable } from "./order-table"

export default function OrderPage() {
  const [date, setDate] = useDateRange()

  const orders = useTanstackQuery({
    ...convexQuery(api.orders.findAllSortedByDate, {
      from: date?.from?.getTime(),
      to: date?.to?.getTime(),
      notEqual: "ARCHIVE",
    }),
    enabled: !!date?.from && !!date.to,
  })

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      {orders.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderTable data={orders.data} columns={columnsOrder} />
      )}
    </div>
  )
}
