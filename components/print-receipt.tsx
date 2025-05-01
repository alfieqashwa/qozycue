import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
  formattedPrice,
  formattedPriceBasedOnCountryCode,
} from "@/lib/format-price"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Phone } from "lucide-react"
import { RefObject, type Ref } from "react"

type PrintReceiptProps = {
  orderId: Id<"orders">
  poolTableName?: string
  customerName?: string
  printStatus?: "receipt" | "bill"
  locale: string
  currency: string
  ref: RefObject<HTMLDivElement | null>
}
export const PrintReceipt = ({
  orderId,
  poolTableName,
  customerName,
  printStatus = "receipt",
  locale,
  currency,
  ref,
}: PrintReceiptProps) => {
  const [{ data: order, status }, { data: orderlines }, defaultTax] =
    useTanstackQueries({
      queries: [
        {
          ...convexQuery(api.orders.findById, { id: orderId }),
          enabled: Boolean(orderId),
        },
        {
          ...convexQuery(api.orderlines.findAllByOrderId, { orderId }),
          enabled: Boolean(orderId),
        },
        convexQuery(api.taxes.findDefaultValue, {}),
      ],
    })

  const formattedCurrentDate = format(new Date(), "dd/MM/yyyy:HH:mm:ss", {
    locale: id,
  })
  const totalCost = order?.poolRental._id
    ? (order.poolRental.totalCost as number)
    : 0
  const totalAmount =
    orderlines?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0

  const formattedPacketCost = formattedPrice(locale).format(
    Number(order?.poolRental.packet?.cost),
  )
  const formattedRate = order?.poolRental.packet?.rate === "HOUR" ? "hr" : "min"
  const formattedTotalCost = formattedPrice(locale).format(
    Number(order?.poolRental.totalCost?.toFixed(0)),
  )
  const formattedTotalOrder = formattedPrice(locale).format(Number(totalAmount))
  const subTotal = totalCost + totalAmount
  const formattedSubTotal = formattedPrice(locale).format(Number(subTotal))

  const discount = order?.discount
  const tax =
    order?.tax ?? (defaultTax.status === "success" ? defaultTax.data?.value : 0)

  return (
    <div
      className="text-muted bg-white p-8 font-mono"
      ref={ref as Ref<HTMLDivElement> | undefined}
    >
      {status === "success" && !!order && (
        <main className="text-xs">
          {/* STARTS HEADER */}
          <section>
            <h2 className="text-center text-base font-semibold capitalize">
              {order.company?.name}
            </h2>
            <article className="mx-auto w-1/2 text-center">
              <p className="leading-4 capitalize">{order.company?.location}</p>
              <p className="flex items-center justify-center">
                <Phone className="mr-1 size-3" />
                <span>{order.company?.phone}</span>
              </p>
            </article>
            <h2 className="pt-1 text-center text-base font-medium uppercase">
              {printStatus === "receipt" ? "receipt" : "bill"}
            </h2>
          </section>
          {/* ENDS HEADER */}

          {/* STARTS INFO */}
          <section className="pt-2">
            <article>
              <p>Date: {formattedCurrentDate}</p>
              <p className="features-title">
                Order: #{orderId.slice(-8, orderId.length)}
              </p>
            </article>
            <article>
              <p className="capitalize">
                Customer: {!!customerName ? customerName : "-"}
              </p>
              <p>Cashier: {order.createdBy?.name}</p>
            </article>
          </section>
          {/* ENDS INFO */}

          {/* STARTS POOL RENTAL */}
          {!!order.poolRental._id && (
            <section className="pt-2 pl-4">
              <h3 className="-ml-4 uppercase">Pool Rental</h3>
              <div className="flex items-center justify-between">
                <p>Table:</p>
                <p> {poolTableName}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Packet:</p>
                <p className="capitalize">{order.poolRental.packet?.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Cost:</p>
                <p>
                  {formattedPacketCost}/<span>{formattedRate}</span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Start:</p>
                <p>
                  {order.poolRental.timeStart &&
                    format(
                      new Date(order.poolRental.timeStart as number),
                      "pp",
                      {
                        locale: id,
                      },
                    )}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>End:</p>
                <p>
                  {order.poolRental.timeEnd &&
                    format(new Date(order.poolRental.timeEnd as number), "pp", {
                      locale: id,
                    })}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Duration:</p>
                <p>
                  {order.poolRental.duration}
                  <span className="ml-1">{formattedRate}</span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p>Price:</p>
                <p>{formattedTotalCost}</p>
              </div>
            </section>
          )}
          {/* ENDS POOL RENTAL */}

          {/* STARTS ORDERLINES */}
          {!!orderlines?.length && (
            <section className="pt-2 pl-4">
              <h3 className="-ml-4 uppercase">Orders</h3>
              <ul>
                <li className="flex w-full items-center">
                  <div className="w-2/12 text-left">
                    <p>Qty</p>
                  </div>
                  <div className="w-7/12">
                    <p>Item</p>
                  </div>
                  <div className="w-3/12 text-right">
                    <p>Amount</p>
                  </div>
                </li>
                {orderlines?.map((orderline) => {
                  return (
                    <li
                      className="flex w-full items-center"
                      key={orderline._id}
                    >
                      <div className="w-2/12 pr-16 text-right">
                        <p>{orderline.quantity}</p>
                      </div>
                      <div className="flex w-7/12 flex-col -space-y-1 py-0.5">
                        <p className="capitalize">{orderline.product.name}</p>
                        <p className="italic">
                          <span>@</span>
                          {formattedPrice(locale).format(
                            Number(orderline.product.salePrice),
                          )}
                        </p>
                      </div>
                      <div className="w-3/12 text-right">
                        <p>
                          {formattedPrice(locale).format(
                            Number(orderline.amount),
                          )}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          {/* ENDS POOL ORDERLINES */}

          {/* STARTS PAYMENTS */}
          <section className="pt-4">
            {!!order.poolRental._id && (
              <div className="flex items-center justify-between">
                <p>Total Rental:</p>
                <p>{formattedTotalCost}</p>
              </div>
            )}
            {!!orderlines?.length && (
              <div className="flex items-center justify-between">
                <p>Total Order:</p>
                <p>{formattedTotalOrder}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p>{printStatus === "receipt" ? "SubTotal" : "Total"}:</p>
              <p>{formattedSubTotal}</p>
            </div>

            {printStatus === "receipt" && !!discount && discount > 0 && (
              <div className="flex items-center justify-between">
                <p>Disc ({discount * 100}%):</p>
                <p>
                  {formattedPrice(locale).format(
                    Number(discount * subTotal * -1),
                  )}
                </p>
              </div>
            )}
            {!!tax && tax > 0 && (
              <div className="flex items-center justify-between">
                <p>PPN ({tax * 100}%):</p>
                <p>{formattedPrice(locale).format(Number(tax * subTotal))}</p>
              </div>
            )}
            {printStatus === "receipt" && (
              <div className="flex items-center justify-between">
                <p>Payment:</p>
                <p>{order.paymentMethod}</p>
              </div>
            )}
          </section>
          {/* ENDS PAYMENTS */}

          {/* STARTS GRAND TOTAL */}
          <section className="pt-2">
            <div className="flex items-center justify-between">
              <p>Grand Total:</p>
              <p>
                {printStatus === "receipt"
                  ? formattedPriceBasedOnCountryCode(locale, currency).format(
                      Number(order.totalAmount),
                    )
                  : !!tax &&
                    formattedPriceBasedOnCountryCode(locale, currency).format(
                      Number(subTotal + tax * subTotal),
                    )}
              </p>
            </div>
          </section>
          {/* ENDS GRAND TOTAL */}

          {/* STARTS FOOTER */}
          <section className="pt-4 text-center">
            <h3 className="uppercase">
              {printStatus === "receipt"
                ? "Thanks for visiting"
                : "Bill Printed"}
            </h3>
          </section>
          {/* ENDS FOOTER */}
        </main>
      )}
    </div>
  )
}

//? source -> https://chatgpt.com/c/67371a5b-3118-8002-8897-64ddd5e71a95
PrintReceipt.displayName = "PrintReceipt"
