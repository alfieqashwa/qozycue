import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { useEffect, useState } from "react"
import { OrderProduct } from "./order-product"

export function ProductMenuCard({
  isCashier,
  isDesktop,
  orderlines,
  orderId,
  productId,
  name,
  price,
  className,
  children,
}: {
  isCashier: boolean
  isDesktop: boolean
  orderlines?: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  orderId: Id<"orders">
  productId: Id<"products">
  name: string
  price: number
  className?: string
  children: React.ReactNode
}) {
  const [qty, setQty] = useState(0)

  const orderline = orderlines?.find(
    (orderline) =>
      orderline.orderId === orderId &&
      orderline.productId === productId &&
      orderline.orderlineStatus === "UNORDERED",
  )

  useEffect(() => {
    if (typeof orderline?.quantity !== "number") {
      return setQty(0)
    }

    setQty(orderline.quantity)
  }, [orderline?.quantity])

  return (
    <li
      className={cn(
        "h-40 w-48 shrink-0 rounded-2xl p-3 text-muted shadow-xl md:h-44 md:w-52",
        className,
        !orderline && "opacity-70 transition-colors duration-500 ease-in-out",
      )}
    >
      <div className={cn("text-muted", !!orderline && "animate-bounce")}>
        {children}
      </div>
      <ProductTitleTooltip isDesktop={isDesktop} name={name}>
        <article className="mt-2 md:mt-4">
          <h2 className="truncate font-semibold capitalize md:text-xl">
            {name}
          </h2>
          <p className="text-sm font-medium md:text-base">
            {formattedPrice.format(Number(price))}
          </p>
        </article>
      </ProductTitleTooltip>
      <OrderProduct
        isCashier={isCashier}
        orderId={orderId}
        orderline={orderline}
        productId={productId}
        name={name}
        price={price}
        qty={qty}
        setQty={setQty}
      />
    </li>
  )
}

const ProductTitleTooltip = ({
  isDesktop,
  name,
  children,
}: {
  isDesktop: boolean
  name: string
  children: React.ReactNode
}) => {
  return (
    <>
      {isDesktop ? (
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent className="bg-muted capitalize text-foreground">
            {name}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Popover>
          <PopoverTrigger asChild>{children}</PopoverTrigger>
          <PopoverContent
            side="top"
            className="w-auto bg-muted py-1.5 text-xs capitalize text-muted-foreground"
          >
            {name}
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
