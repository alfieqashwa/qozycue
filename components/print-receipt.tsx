import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Phone } from "lucide-react"
import { forwardRef, type LegacyRef } from "react"
import { formattedPrice, formattedPriceWithRupiah } from "~/lib/format-price"
import { api } from "~/trpc/react"

type PrintReceiptProps = {
  orderId: string
  customerName?: string
  printStatus?: "receipt" | "bill"
}
export const PrintReceipt = forwardRef(
  (
    { orderId, customerName, printStatus = "receipt" }: PrintReceiptProps,
    ref,
  ) => {
    const { data: order, status } = api.order.findById.useQuery(
      {
        id: orderId,
        notIn: ["ARCHIVE"],
      },
      {
        enabled: !!orderId,
        select: (data) => ({
          data: data,
          date: data?.createdAt,
          poolRental: data?.poolRental,
          poolTableName: data?.poolRental?.poolTable?.name,
          orderlines: data?.orderLines,
          hasOrderlines: !!data?.orderLines.length,
          company: data?.company,
        }),
      },
    )

    const formattedCurrentDate = format(new Date(), "dd/MM/yyyy:HH:mm:ss", {
      locale: id,
    })
    const totalCost = !!order?.poolRental ? order?.poolRental.totalCost : 0
    const totalAmount =
      order?.orderlines?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0

    const formattedPacketCost = formattedPrice.format(
      Number(order?.poolRental?.packet.cost),
    )
    const formattedRate =
      order?.poolRental?.packet.rate === "HOUR" ? "hr" : "min"
    const formattedTotalCost = formattedPrice.format(
      Number(order?.poolRental?.totalCost.toFixed(0)),
    )
    const formattedTotalOrder = formattedPrice.format(Number(totalAmount))
    const subTotal = totalCost + totalAmount
    const formattedSubTotal = formattedPrice.format(Number(subTotal))

    const discount = order?.data?.discount
    const tax = order?.data?.tax

    return (
      <div
        className="bg-white p-8 font-mono text-muted"
        ref={ref as LegacyRef<HTMLDivElement> | undefined}
      >
        {status === "success" && (
          <main className="text-xs">
            {/* STARTS HEADER */}
            <section>
              <h2 className="text-center text-base font-semibold capitalize">
                {order.company?.name}
              </h2>
              <article className="mx-auto w-1/2 text-center">
                <p className="capitalize leading-4">
                  {order.company?.location}
                </p>
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
                <p>Cashier: {order.data?.createdBy?.name}</p>
              </article>
            </section>
            {/* ENDS INFO */}

            {/* STARTS POOL RENTAL */}
            {!!order.poolRental && (
              <section className="pl-4 pt-2">
                <h3 className="-ml-4 uppercase">Pool Rental</h3>
                <div className="flex items-center justify-between">
                  <p>Table:</p>
                  <p> {order.poolTableName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Packet:</p>
                  <p className="capitalize">{order.poolRental.packet.name}</p>
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
                    {format(order.poolRental.timeStart as Date, "pp", {
                      locale: id,
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p>End:</p>
                  <p>
                    {format(order.poolRental.timeEnd as Date, "pp", {
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
            {order.hasOrderlines && (
              <section className="pl-4 pt-2">
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
                  {order.orderlines?.map((orderline) => {
                    return (
                      <li
                        className="flex w-full items-center"
                        key={orderline.id}
                      >
                        <div className="w-2/12 pr-16 text-right">
                          <p>{orderline.quantity}</p>
                        </div>
                        <div className="flex w-7/12 flex-col -space-y-1 py-0.5">
                          <p className="capitalize">{orderline.product.name}</p>
                          <p className="italic">
                            <span>@</span>
                            {formattedPrice.format(
                              Number(orderline.product.salePrice),
                            )}
                          </p>
                        </div>
                        <div className="w-3/12 text-right">
                          <p>
                            {formattedPrice.format(Number(orderline.amount))}
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
              {!!order.poolRental && (
                <div className="flex items-center justify-between">
                  <p>Total Rental:</p>
                  <p>{formattedTotalCost}</p>
                </div>
              )}
              {order.hasOrderlines && (
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
                    {formattedPrice.format(Number(discount * subTotal * -1))}
                  </p>
                </div>
              )}
              {printStatus === "receipt" && !!tax && tax > 0 && (
                <div className="flex items-center justify-between">
                  <p>PPN ({tax * 100}%):</p>
                  <p>{formattedPrice.format(Number(tax * subTotal))}</p>
                </div>
              )}
              {printStatus === "receipt" && (
                <div className="flex items-center justify-between">
                  <p>Payment:</p>
                  <p>{order.data?.paymentMethod}</p>
                </div>
              )}
            </section>
            {/* ENDS PAYMENTS */}

            {/* STARTS GRAND TOTAL */}
            {printStatus === "receipt" && (
              <section className="pt-2">
                <div className="flex items-center justify-between">
                  <p>Grand Total:</p>
                  <p>
                    {formattedPriceWithRupiah.format(
                      Number(order.data?.totalAmount),
                    )}
                  </p>
                </div>
              </section>
            )}
            {/* ENDS GRAND TOTAL */}

            {/* STARTS FOOTER */}
            <section className="pt-4 text-center">
              <h3 className="uppercase">
                {printStatus === "receipt"
                  ? "Thanks for visiting"
                  : "Exclude Disc & PPN"}
              </h3>
            </section>
            {/* ENDS FOOTER */}
          </main>
        )}
      </div>
    )
  },
)
