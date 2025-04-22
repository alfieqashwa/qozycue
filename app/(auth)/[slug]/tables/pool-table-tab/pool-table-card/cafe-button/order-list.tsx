import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { Coffee, ShoppingBasket, Soup, Trash2 } from "lucide-react"
import { Fragment } from "react"
import { toast } from "sonner"
import { PrintOrder } from "./print-order"
import { ReprintOrder } from "./reprint-order"

export function OrderList({
  isManager,
  isCashier,
  orderlines,
  poolTableName,
  customerName,
}: {
  isManager: boolean
  isCashier: boolean
  orderlines: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  poolTableName?: string
  customerName?: string
}) {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.remove),
    onSuccess() {
      const productName = orderlines.find(
        (orderline) => orderline._id === variables?.id,
      )?.product.name
      toast("Remove!", {
        unstyled: true,

        description: (
          <p className="text-muted/70 font-semibold capitalize">
            {productName}
          </p>
        ),
        classNames: {
          toast:
            "flex items-center border-2 border-red-900 w-full pl-2 py-3 rounded-lg shadow-lg bg-red-200",
          title: "pl-8 text-muted font-medium tracking-wide",
        },
        icon: (
          <Trash2
            size={28}
            strokeWidth={2.5}
            className="text-destructive ml-2.5 animate-pulse"
          />
        ),
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  return (
    <div className="bg-card mt-1.5 rounded-2xl py-4 xl:w-4/12">
      {!!poolTableName && (
        <h1 className="text-center whitespace-nowrap sm:text-lg md:text-xl">
          Table {poolTableName}
        </h1>
      )}
      {!!customerName && (
        <h1 className="text-muted-foreground truncate text-center whitespace-nowrap capitalize sm:text-sm md:text-lg">
          {customerName}
        </h1>
      )}

      <div className="mx-8 mt-2 flex items-center justify-between space-x-2">
        <ReprintOrder
          isManager={isManager}
          orderlines={orderlines}
          poolTableName={poolTableName}
          customerName={customerName}
        />
        <PrintOrder
          isCashier={isCashier}
          orderlines={orderlines}
          poolTableName={poolTableName}
          customerName={customerName}
        />
      </div>
      <ScrollArea className="h-svh px-8 pt-4">
        <ul className="min-w-max">
          {orderlines
            .sort((p, q) => q.orderlineStatus.localeCompare(p.orderlineStatus))
            .map((orderline) => {
              const categoryName = orderline.product.category?.name

              const icon =
                categoryName === "food" ? (
                  <Soup size={32} className="text-emerald-200" />
                ) : categoryName === "drink" ? (
                  <Coffee className="text-fuchsia-200" size={32} />
                ) : (
                  <ShoppingBasket size={32} className="text-lime-200" />
                )
              const textColor =
                categoryName === "food"
                  ? "text-emerald-200"
                  : categoryName === "drink"
                    ? "text-fuchsia-200"
                    : "text-lime-200"

              return (
                <Fragment key={orderline._id}>
                  <li
                    className={cn(
                      "mt-2 flex flex-col space-y-1.5 py-2 xl:flex-row xl:items-center xl:space-y-0",
                      (isPending || orderline.orderlineStatus === "ORDERED") &&
                        "opacity-50",
                    )}
                  >
                    <div
                      className={cn(
                        "hidden xl:block",
                        isPending && "animate-bounce",
                      )}
                    >
                      {icon}
                    </div>
                    <div className="relative flex w-full items-center justify-between space-x-2 xl:mx-4 xl:w-9/12">
                      <section className="w-full">
                        <h3 className={cn("font-medium capitalize", textColor)}>
                          {orderline.product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          <span>
                            {formattedPrice.format(
                              Number(orderline.product.salePrice),
                            )}
                            /{orderline.product.unitOfMeasure?.name}
                          </span>
                        </p>
                      </section>
                      <div className="bg-muted relative min-h-9 min-w-10 rounded-md border shadow-md">
                        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold">
                          {orderline.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="mr-2 w-full xl:w-3/12 xl:max-w-24">
                      <p
                        className={cn(
                          "text-right text-sm font-medium",
                          orderline.isFree &&
                            "text-muted-foreground line-through",
                        )}
                      >
                        {formattedPrice.format(Number(orderline.amount))}
                      </p>
                    </div>
                    <Button
                      disabled={
                        !isCashier ||
                        isPending ||
                        orderline.orderlineStatus === "ORDERED"
                      }
                      onClick={() =>
                        mutate({
                          id: orderline._id,
                          productId: orderline.product._id as Id<"products">,
                          countInStock:
                            (orderline.product.countInStock as number) +
                            orderline.quantity,
                        })
                      }
                      className="bg-muted hover:bg-muted/75 relative min-h-9 min-w-10 rounded-md shadow-md transition-colors hover:cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed"
                    >
                      <Trash2
                        size={18}
                        className="text-destructive absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    </Button>
                  </li>
                  <Separator />
                </Fragment>
              )
            })}
        </ul>
      </ScrollArea>
    </div>
  )
}
