"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
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

export default function OrderlinePage() {
  const [date, setDate] = useDateRange()

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
      <CustomDatePicker date={date} setDate={setDate} />
      {orderlines.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderlineTable data={orderlines.data} columns={columnsOrderline} />
      )}
    </div>
  )
}
