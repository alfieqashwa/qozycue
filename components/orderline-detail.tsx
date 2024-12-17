"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { BaggageClaim, Coffee, ShoppingBasket, Soup } from "lucide-react"
import { Fragment, useMemo } from "react"

export function OrderlineDetail({
  orderId,
}: {
  orderId: Id<"orders"> | undefined
}) {
  const { data: orderlines, status } = useTanstackQuery({
    ...convexQuery(api.orderlines.findAllByOrderId, { orderId }),
    enabled: Boolean(orderId),
  })

  const totalAmount = useMemo(() => {
    return orderlines
      ?.filter((orderline) => !orderline.isFree) // filtered only not free order
      .reduce((acc, curr) => acc + curr.amount, 0)
  }, [orderlines])
  const totalQty = useMemo(() => {
    return orderlines?.reduce((acc, curr) => acc + curr.quantity, 0)
  }, [orderlines])

  return (
    <section className="relative">
      <ScrollArea className="-mx-5 h-[calc(100vh_-_24rem)] border-b">
        <ul className="px-5">
          {status === "success" &&
            orderlines
              ?.sort((p, q) =>
                q.orderlineStatus.localeCompare(p.orderlineStatus),
              )
              .map((orderline) => {
                const categoryName = orderline.product.category?.name

                const icon =
                  categoryName === "food" ? (
                    <Soup className="text-emerald-200 md:size-8" />
                  ) : categoryName === "drink" ? (
                    <Coffee className="text-fuchsia-200 md:size-8" />
                  ) : (
                    <ShoppingBasket className="text-lime-200 md:size-8" />
                  )
                const textColor =
                  categoryName === "food"
                    ? "text-emerald-200"
                    : categoryName === "drink"
                      ? "text-fuchsia-200"
                      : "text-lime-200"

                return (
                  <Fragment key={orderline._id}>
                    <li className="relative flex w-full items-center py-1 md:py-2">
                      {orderline.isFree && (
                        <div className="absolute right-0 top-0">
                          <h6 className="rounded-sm bg-muted px-1 text-end text-xs font-medium tracking-widest text-amber-300">
                            Free
                          </h6>
                        </div>
                      )}
                      <span>{icon}</span>
                      <div className="flex w-9/12 items-center justify-between pl-4">
                        <section>
                          <h3
                            className={cn(
                              "text-sm font-medium capitalize md:text-base",
                              textColor,
                            )}
                          >
                            {orderline.product.name}
                          </h3>
                          <div className="text-xs font-medium text-muted-foreground md:text-sm">
                            {formattedPrice.format(
                              Number(orderline.product.salePrice),
                            )}
                            /{orderline.product.unitOfMeasure?.name}
                            {orderline.orderlineStatus === "UNORDERED" && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-[10px] uppercase tracking-widest text-amber-400"
                              >
                                unordered
                              </Badge>
                            )}
                          </div>
                        </section>
                        <div className="relative h-8 w-10 rounded-md border bg-muted text-sm shadow-md md:h-10 md:w-12 md:text-base">
                          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
                            {orderline.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="w-3/12">
                        <p
                          className={cn(
                            "text-right text-xs font-medium md:text-sm",
                            orderline.isFree &&
                              "text-muted-foreground line-through",
                          )}
                        >
                          {formattedPrice.format(Number(orderline.amount))}
                        </p>
                      </div>
                    </li>
                    <Separator className="my-0.5" />
                  </Fragment>
                )
              })}
        </ul>
      </ScrollArea>
      {/* === STARTS SUMMARY OF TOTAL ORDERS === */}
      <div className="mt-3 flex w-full items-center justify-between text-cyan-600">
        <BaggageClaim className="md:size-8" />
        <div className="flex w-9/12 items-center justify-between">
          {status === "success" && (
            <h3 className="flex-1 whitespace-nowrap pl-4 text-sm font-medium md:text-base">
              {orderlines?.length} order
              <span className={cn(orderlines.length <= 1 && "hidden")}>s</span>
            </h3>
          )}
          <div className="relative h-8 w-10 rounded-md border bg-muted text-sm shadow-md md:h-10 md:w-12 md:text-base">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
              {formattedPrice.format(Number(totalQty))}
            </p>
          </div>
        </div>
        <div className="w-3/12">
          <p className="text-right text-xs font-semibold md:text-sm">
            {formattedPrice.format(Number(totalAmount))}
          </p>
        </div>
      </div>
      {/* === ENDS SUMMARY OF TOTAL ORDERS === */}
    </section>
  )
}
