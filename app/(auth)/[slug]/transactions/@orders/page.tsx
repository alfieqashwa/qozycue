"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { type ICountry } from "@/types"
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

  const company = useTanstackQuery({
    ...convexQuery(api.companies.find, {}),
  })

  const { locale, currency } = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  ) as ICountry

  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} />
      {orders.status !== "success" ? (
        <SkeletonDashboardCard className="h-[700px]" />
      ) : (
        <OrderTable
          data={orders.data}
          columns={columnsOrder(locale, currency)}
        />
      )}
    </div>
  )
}
