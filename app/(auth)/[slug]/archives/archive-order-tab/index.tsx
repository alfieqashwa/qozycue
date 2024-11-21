"use client"

import { addDays } from "date-fns"
import { type Session } from "next-auth"
import { useState } from "react"
import { type DateRange } from "react-day-picker"
import { SkeletonDashboardCard } from "@/app/_components/skeleton-dashboard-card"
import { api } from "@/trpc/react"
import { TransactionDatePicker } from "../../transactions/transactions-date-picker"
import { columnsArchiveOrder } from "./columns-archive-order"
import { OrderTable } from "./order-table"

export function ArchiveOrderTab({ session }: { session: Session | null }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
    to: new Date(new Date().setHours(23, 59, 59, 0)),
  })

  const orders = api.order.findAllByCompanyIdSortedByDate.useQuery(
    { from: date?.from, to: date?.to, notIn: ["OPEN", "PENDING", "PAID"] },
    { enabled: !!date?.from && !!date?.to },
  )

  const managerAndCashierAccessLevel =
    session?.user.role === "ADMIN" ||
    session?.user.role === "DEWA" ||
    session?.user.role === "MANAGER" ||
    session?.user.role === "CASHIER"

  const disabledBasedOnAccessLevel = !managerAndCashierAccessLevel

  return (
    <div className="relative">
      <TransactionDatePicker date={date} setDate={setDate} />

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
