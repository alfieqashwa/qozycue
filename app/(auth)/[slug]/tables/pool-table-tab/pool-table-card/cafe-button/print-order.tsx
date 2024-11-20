"use-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { Coffee, Printer, ShoppingBasket, Soup } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { toast } from "sonner"
import { PrintOrderButton } from "./print-order-button"
import { WrapperDialog } from "./wrapper-modal"

export function PrintOrder({
  isCashier,
  orderlines,
  poolTableName,
  customerName,
}: {
  isCashier: boolean
  orderlines: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  poolTableName?: string
  customerName?: string
}) {
  const orderRef = useRef(null)
  const [orderBy, setOrderBy] = useState("")
  const [notes, setNotes] = useState("")
  const [open, setOpen] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.updateOrderlineStatusList),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Update to Ordered",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(true),
  })

  // STARTS PRINT THE ORDER CONFIGURATiON
  const orderId = orderlines[0].orderId
  const handleOrderPrint = useReactToPrint({
    content: () => orderRef.current,
    documentTitle: `receipt_order_${orderId.slice(-8, orderId.length)}`,
    onPrintError: () => {
      alert("There is an error when printing order.")
      setOpen(false)
      setOrderBy("")
      setNotes("")
    },
    onAfterPrint: () => {
      setOpen(false)
      setOrderBy("")
      setNotes("")
    },
  })
  // ENDS PRINT THE ORDER CONFIGURATiON

  const handleUpdateOrderlineStatusList = (categoryName: string) => {
    const categoryOrder = ["food", "drink", "others"]

    const unOrderedOrderlineIds = orderlines
      .filter((orderline) => {
        if (categoryName === "all") {
          return orderline.orderlineStatus === "UNORDERED"
        } else {
          return (
            orderline.product.category?.name === categoryName &&
            orderline.orderlineStatus === "UNORDERED"
          )
        }
      })
      // sorted based on the indexOf categoryOrder's array
      .sort(
        (p, q) =>
          categoryOrder.indexOf(p.product.category?.name as string) -
          categoryOrder.indexOf(q.product.category?.name as string),
      )
      .map((orderline) => orderline._id)

    mutate({ ids: unOrderedOrderlineIds })
  }

  const handleCloseAutoFocus = () => {
    setOpen(false)
    setOrderBy("")
    setNotes("")
  }

  const hasOrderBy = orderBy && orderBy.length >= 3 && orderBy.length <= 20 // orderBy must have at least 3 chars && max 20 chars
  const hasFood = orderlines.some(
    (o) =>
      o.orderlineStatus === "UNORDERED" && o.product.category?.name === "food",
  )
  const hasDrink = orderlines.some(
    (o) =>
      o.orderlineStatus === "UNORDERED" && o.product.category?.name === "drink",
  )
  const hasOthers = orderlines.some(
    (o) =>
      o.orderlineStatus === "UNORDERED" &&
      o.product.category?.name === "others",
  )

  return (
    <WrapperDialog
      contentText="Cashier Only"
      title="Print Order"
      disabled={
        !isCashier ||
        isPending ||
        orderlines.every((o) => o.orderlineStatus === "ORDERED")
      }
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4 md:gap-x-4">
        <Input
          placeholder="Order by"
          name="orderBy"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="col-span-3 capitalize"
        />
        <Textarea
          disabled={!hasOrderBy}
          placeholder="Notes... (optional)"
          name="note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={cn(
            "col-span-3 resize-none",
            hasOrderBy ? "block" : "hidden",
          )}
        />
        <Button
          disabled={isPending || !hasFood || !hasOrderBy}
          variant="secondary"
          size="lg"
          onClick={() => handleUpdateOrderlineStatusList("food")}
          className="flex items-center justify-center space-x-2 text-emerald-200 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Soup className="size-5 shrink-0 md:size-6" />
          <span className="text-xs font-semibold uppercase tracking-widest md:text-base">
            Food
          </span>
        </Button>
        <Button
          disabled={isPending || !hasDrink || !hasOrderBy}
          variant="secondary"
          size="lg"
          onClick={() => handleUpdateOrderlineStatusList("drink")}
          className="flex items-center justify-center space-x-2 text-fuchsia-200 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Coffee className="size-5 shrink-0 md:size-6" />
          <span className="text-xs font-semibold uppercase tracking-widest md:text-base">
            Drink
          </span>
        </Button>
        <Button
          disabled={isPending || !hasOthers || !hasOrderBy}
          variant="secondary"
          size="lg"
          onClick={() => handleUpdateOrderlineStatusList("others")}
          className="flex items-center justify-center space-x-2 text-lime-200 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <ShoppingBasket className="size-5 shrink-0 md:size-6" />
          <span className="text-xs font-semibold uppercase tracking-widest md:text-base">
            Others
          </span>
        </Button>
        <Button
          disabled={
            isPending ||
            orderlines.every((o) => o.orderlineStatus === "ORDERED") ||
            !hasOrderBy
          }
          variant="secondary"
          size="lg"
          onClick={() => handleUpdateOrderlineStatusList("all")}
          className="col-span-3 flex items-center justify-center space-x-4"
        >
          <Soup size={24} className="shrink-0 text-emerald-200" />
          <Coffee size={24} className="shrink-0 text-fuchsia-200" />
          <ShoppingBasket size={24} className="shrink-0 text-lime-200" />
        </Button>
      </div>
      <div
        className={cn(
          open === false ? "hidden" : "flex flex-col items-center",
          "shrink-0 space-y-6",
        )}
      >
        <ScrollArea className="h-[20rem] w-8/12 md:h-[28rem] md:pt-4">
          <PrintOrderButton
            ids={variables?.ids}
            // ids={variables?.ids as Array<{ id: string }>}
            poolTableName={poolTableName}
            customerName={customerName}
            orderBy={orderBy}
            notes={notes}
            ref={orderRef}
          />
        </ScrollArea>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => handleCloseAutoFocus()}>
            Close
          </Button>
          <Button onClick={handleOrderPrint}>
            <Printer className="mr-2 size-4" />
            <span>Print</span>
          </Button>
        </div>
      </div>
    </WrapperDialog>
  )
}
