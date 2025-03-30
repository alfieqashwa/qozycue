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
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { useEffect, useState } from "react"
import { OrderProduct } from "./order-product"

type ProductMenuCardProps = {
  isCashier: boolean
  isDesktop: boolean
  orderlines?: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  orderId: Id<"orders">
  productId: Id<"products">
  name: string
  price: number
  isStockable: boolean
  countInStock: number
  bgColor?: string
  stockTextColor?: string
  children: React.ReactNode
}

export function ProductMenuCard({
  isCashier,
  isDesktop,
  orderlines,
  orderId,
  productId,
  name,
  price,
  isStockable,
  countInStock,
  bgColor,
  stockTextColor,
  children,
}: ProductMenuCardProps) {
  const [qty, setQty] = useState(0)
  const [stock, setStock] = useState(countInStock)

  const orderline = orderlines?.find(
    (orderline) =>
      orderline.orderId === orderId &&
      orderline.productId === productId &&
      orderline.orderlineStatus === "UNORDERED",
  )

  useEffect(() => {
    setStock(countInStock) // should be write on top of the qty

    if (typeof orderline?.quantity !== "number") {
      return setQty(0)
    }
    setQty(orderline.quantity)

    // setStock(countInStock) // if write here, it won't updated when user remove the orderline
  }, [countInStock, orderline?.quantity])

  const getStockBackgroundColor = (stock: number): string => {
    if (stock === 0) {
      return "bg-rose-500/70"
    }
    if (stock > 0 && stock <= 5) {
      return "bg-amber-400/70 animate-pulse"
    }
    return "" // Default case (no additional background color)
  }

  return (
    <li
      className={cn(
        "relative mt-4 h-40 w-48 shrink-0 rounded-2xl p-3 text-muted shadow-xl md:h-44 md:w-52",
        bgColor,
        !orderline && "opacity-70 transition-colors duration-500 ease-in-out",
      )}
    >
      {/* STOCK */}
      {isStockable && (
        <WrapperTooltip content="Stock">
          <div
            className={cn(
              "absolute -right-4 -top-4 z-[999] h-8 w-8 rounded-full",
              bgColor,
              getStockBackgroundColor(stock),
            )}
          >
            <p
              className={cn(
                "flex h-full w-full items-center justify-center text-sm font-semibold",
                stockTextColor,
                stock <= 5 && "text-foreground",
              )}
            >
              {stock}
            </p>
          </div>
        </WrapperTooltip>
      )}

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
        isStockable={isStockable}
        countInStock={countInStock}
        qty={qty}
        setQty={setQty}
        stock={stock}
        setStock={setStock}
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
