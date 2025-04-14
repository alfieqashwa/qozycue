import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { forwardRef, type Ref } from "react"

type PrintOrderProps = {
  ids: Id<"orderlines">[] | undefined
  poolTableName?: string
  customerName?: string
  orderBy?: string
  notes?: string
  title?: string
}

const categoryOrder = ["food", "drink", "others"]
export const PrintOrderButton = forwardRef(
  (
    {
      ids,
      poolTableName = "Cafe-Only",
      customerName,
      orderBy,
      notes = "-",
      title = "order menu",
    }: PrintOrderProps,
    ref,
  ) => {
    const { data: orderlines, status } = useTanstackQuery({
      ...convexQuery(api.orderlines.findAllByIds, {
        ids: ids as Id<"orderlines">[],
      }),
      enabled: !!ids,
    })

    const formattedCurrentDate = format(new Date(), "dd/MM/yyyy:HH:mm:ss", {
      locale: id,
    })

    return (
      <div
        className="bg-white p-8 font-mono text-muted"
        ref={ref as Ref<HTMLDivElement> | undefined}
      >
        {status === "success" && (
          <main className="text-xs">
            {/* STARTS INFO */}
            {/* STARTS HEADER */}
            <section>
              <article className="mx-auto w-1/2 text-center">
                <h3 className="text-center uppercase">{title}</h3>
              </article>
            </section>
            {/* ENDS HEADER */}
            <section className="pt-2">
              <article>
                <p className="capitalize leading-4">
                  Company: {orderlines[0]?.company?.name}
                </p>
                <p>Date: {formattedCurrentDate}</p>
                <p className="features-title">
                  Order: #
                  {orderlines[0]?.order?._id.slice(
                    -8,
                    orderlines[0].order._id.length,
                  )}
                </p>
              </article>
              <article>
                <p className="capitalize">
                  Table: {poolTableName} ({orderlines[0]?.order?.statusPayment})
                </p>
                <p className="capitalize">Customer: {customerName}</p>
                <p className="capitalize">OrderBy: {orderBy}</p>
              </article>
            </section>
            {/* ENDS INFO */}

            {/* STARTS ORDERLINES */}
            <section className="py-2">
              <ul>
                <li className="flex w-full items-center space-x-2">
                  <p className="w-2/12">
                    <span>Qty</span>
                  </p>
                  <p className="w-9/12">
                    <span>Item</span>
                  </p>
                </li>
                {!!orderlines.length &&
                  orderlines
                    // sorted based on the indexOf categoryOrder's array
                    .sort(
                      (p, q) =>
                        categoryOrder.indexOf(
                          p.product.category?.name as string,
                        ) -
                        categoryOrder.indexOf(
                          q.product.category?.name as string,
                        ),
                    )
                    .map((orderline) => {
                      return (
                        <li
                          className="flex w-full items-start space-x-2"
                          key={orderline._id}
                        >
                          <p className="w-2/12 pr-2 text-right">
                            <span>{orderline.quantity}</span>
                          </p>
                          <p className="flex w-9/12 flex-col">
                            <span className="capitalize">
                              {orderline.product.name}{" "}
                              {orderline.isFree && "(free)"}
                            </span>
                          </p>
                        </li>
                      )
                    })}
                {notes && (
                  <article className="mt-4">
                    <p>Notes:</p>
                    <p>{notes}</p>
                  </article>
                )}
              </ul>
            </section>
            {/* ENDS POOL ORDERLINES */}
          </main>
        )}
      </div>
    );
  },
)

//? source -> https://chatgpt.com/c/67371a5b-3118-8002-8897-64ddd5e71a95
PrintOrderButton.displayName = "PrintOrderButton"
