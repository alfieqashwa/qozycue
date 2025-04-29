"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { OrderlineDetail } from "@/components/orderline-detail"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { FunctionReturnType } from "convex/server"
import { Fragment } from "react"
import { CafeButton } from "../pool-table-tab/pool-table-card/cafe-button"
import { UpdateCustomerInfo } from "../pool-table-tab/pool-table-card/detail-button/update-customer-info"
import { PaymentButton } from "../pool-table-tab/pool-table-card/payment-button"
import { CreateOrderForm } from "./create-order-form"
import { RemoveOrder } from "./remove-order"

type CafeOnlyTabProps = {
  preloadedSession: Preloaded<typeof api.sessions.find>
}
export default function CafeOnlyTab({ preloadedSession }: CafeOnlyTabProps) {
  const { user } = usePreloadedQuery(preloadedSession)
  const managerAccessLevel = ["ZENITH", "ADMIN", "MANAGER"].includes(
    user.role ?? "",
  )
  const cashierAccessLevel = ["ZENITH", "ADMIN", "CASHIER"].includes(
    user.role ?? "",
  )

  const { data: filteredOrders, status } = useTanstackQuery(
    convexQuery(api.orders.findAllCafeOnlyByCompanyId, {}),
  )
  if (status !== "success") return <LoadingSpinner />
  return (
    <Fragment>
      <CreateOrderForm isCashier={cashierAccessLevel} />
      {!!filteredOrders.length ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <CafeOnlyCard
              managerAccessLevel={managerAccessLevel}
              cashierAccessLevel={cashierAccessLevel}
              order={order}
              key={order._id}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground text-center sm:text-xl">
            No order found ...
          </p>
        </div>
      )}
    </Fragment>
  )
}

type CafeOnlyTabCardProps = {
  managerAccessLevel: boolean
  cashierAccessLevel: boolean
  order: FunctionReturnType<typeof api.orders.findAllCafeOnlyByCompanyId>[0]
}

const CafeOnlyCard = ({
  order,
  managerAccessLevel,
  cashierAccessLevel,
}: CafeOnlyTabCardProps) => (
  <div className="bg-card rounded-xl border-2 px-5 py-4" key={order._id}>
    <article className="flex items-center justify-end truncate">
      <UpdateCustomerInfo
        orderId={order._id}
        customerName={order.customer?.name as string}
        customerPhone={order.customer?.phone || "No Phone"}
        statusPayment={order.statusPayment}
      />
    </article>
    <OrderlineDetail orderId={order._id} />
    <div className="flex items-center justify-between space-x-2 py-2">
      {!!order.orderlinesLen ? (
        <PaymentButton
          isCashier={cashierAccessLevel}
          orderId={order._id}
          customerName={order.customer?.name}
          customerPhone={order.customer?.phone}
        />
      ) : (
        <RemoveOrder
          isCashier={cashierAccessLevel}
          orderId={order._id}
          customerName={order.customer?.name as string}
        />
      )}

      {/* === STARTS Cafe Button === */}
      <CafeButton
        isManager={managerAccessLevel}
        isCashier={cashierAccessLevel}
        order={order}
      />
      {/* === ENDS Cafe Button === */}
    </div>
  </div>
)
