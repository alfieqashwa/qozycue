import { LoadingSpinner } from "@/components/loading-spinner"
import { CreateOrderForm } from "./create-order-form"
import { Phone, User2 } from "lucide-react"
import { OrderlineDetail } from "@/components/orderline-detail"
import { PaymentCafeOnlyButton } from "./payment-cafe-only-button"
import { RemoveOrder } from "./remove-order"
import { CafeButton } from "../pool-table-tab/pool-table-card/cafe-button"
import { OrderList } from "../pool-table-tab/pool-table-card/cafe-button/order-list"

export default function CafeOnlyTab({
  managerAccessLevel,
  cashierAccessLevel,
}: {
  managerAccessLevel: boolean
  cashierAccessLevel: boolean
}) {
  const { data: filteredOrders, status } =
    api.order.findAllCafeOnlyByCompanyId.useQuery(undefined, {
      select(data) {
        return data.filter(
          (order) => order.statusPayment === StatusPayment.OPEN,
        )
      },
      refetchInterval: 1000 * 10,
    })
  if (status !== "success") return <LoadingSpinner />
  return (
    <>
      <CreateOrderForm isCashier={cashierAccessLevel} />
      {!!filteredOrders.length ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              className="rounded-xl border-2 bg-card px-5 py-4"
              key={order.id}
            >
              <article className="flex items-center justify-between truncate py-2 text-xs md:text-sm">
                <h1 className="truncate font-semibold capitalize text-foreground">
                  <User2
                    size={16}
                    className="mr-1 inline text-muted-foreground"
                  />
                  {order.customer?.name}
                </h1>
                {!!order.customer?.phone && (
                  <p>
                    <Phone
                      size={14}
                      className="mr-1 inline text-muted-foreground"
                    />
                    {order.customer.phone}
                  </p>
                )}
              </article>
              {!!order.orderLines.length && (
                <OrderlineDetail orderlines={order.orderLines} />
              )}
              <div className="flex items-center justify-between space-x-2 py-2">
                {!!order.orderLines.length ? (
                  <PaymentCafeOnlyButton
                    isCashier={cashierAccessLevel}
                    orderId={order.id}
                    customerName={order.customer?.name}
                    customerPhone={order.customer?.phone}
                    hasOrderlines={!!order?.orderLines.length}
                    orderlines={order.orderLines}
                  />
                ) : (
                  <RemoveOrder
                    isCashier={cashierAccessLevel}
                    orderId={order.id}
                    customerName={order.customer?.name as string}
                  />
                )}

                {/* === STARTS Cafe Button === */}
                <CafeButton isCashier={cashierAccessLevel} order={order}>
                  {!!order.orderLines.length && (
                    <OrderList
                      isManager={managerAccessLevel}
                      isCashier={cashierAccessLevel}
                      orderlines={order.orderLines}
                      customerName={order.customer?.name}
                    />
                  )}
                </CafeButton>
                {/* === ENDS Cafe Button === */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-muted-foreground sm:text-xl">
            No order found ...
          </p>
        </div>
      )}
    </>
  )
}
