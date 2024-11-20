"use-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { Coffee, Printer, ShoppingBasket, Soup } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { PrintOrderButton } from "./print-order-button"
import { WrapperDialog } from "./wrapper-modal"

type TVariables = { ids: Id<"orderlines">[] }

export function ReprintOrder({
  isManager,
  orderlines,
  poolTableName,
  customerName,
}: {
  isManager: boolean
  orderlines: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  poolTableName?: string
  customerName?: string
}) {
  const orderRef = useRef(null)
  const [variables, setVariables] = useState<TVariables>()
  const [reOrderBy, setReOrderBy] = useState("")
  const [notes, setNotes] = useState("")

  const [open, setOpen] = useState(false)

  // STARTS PRINT THE ORDER CONFIGURATiON
  const orderId = orderlines?.[0]?.orderId as string
  const handleOrderPrint = useReactToPrint({
    content: () => orderRef.current,
    documentTitle: `receipt_order_${orderId.slice(-8, orderId.length)}`,
    onPrintError: () => {
      alert("There is an error when printing order.")
      setOpen(false)
      setReOrderBy("")
      setNotes("")
    },
    onAfterPrint: () => {
      setOpen(false)
      setReOrderBy("")
      setNotes("")
    },
  })
  // ENDS PRINT THE ORDER CONFIGURATiON

  const handleUpdateOrderlineStatusList = (categoryName: string) => {
    setOpen(true)

    const unOrderedOrderlineIds = orderlines
      .filter((orderline) => {
        if (categoryName === "all") {
          return orderline.orderlineStatus === "ORDERED"
        } else {
          return (
            orderline.product.category?.name === categoryName &&
            orderline.orderlineStatus === "ORDERED"
          )
        }
      })
      .map((orderline) => orderline._id)

    setVariables({ ids: unOrderedOrderlineIds })
  }

  const handleCloseAutoFocus = () => {
    setOpen(false)
    setReOrderBy("")
    setNotes("")
  }

  const hasOrderBy =
    reOrderBy && reOrderBy.length >= 3 && reOrderBy.length <= 20 // orderBy must have at least 3 chars && max 20 chars
  const hasFood = orderlines.some(
    (o) =>
      o.orderlineStatus === "ORDERED" && o.product.category?.name === "food",
  )
  const hasDrink = orderlines.some(
    (o) =>
      o.orderlineStatus === "ORDERED" && o.product.category?.name === "drink",
  )
  const hasOthers = orderlines.some(
    (o) =>
      o.orderlineStatus === "ORDERED" && o.product.category?.name === "others",
  )

  const disabled = orderlines.every((o) => o.orderlineStatus === "UNORDERED")

  return (
    <WrapperDialog
      contentText="Manager Only"
      title="Reprint Order"
      disabled={disabled || !isManager}
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4 md:gap-x-4">
        <Input
          placeholder="Re-order by"
          name="reorderBy"
          value={reOrderBy}
          onChange={(e) => setReOrderBy(e.target.value)}
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
          disabled={!hasFood || !hasOrderBy}
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
          disabled={!hasDrink || !hasOrderBy}
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
          disabled={!hasOthers || !hasOrderBy}
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
          disabled={disabled || !hasOrderBy}
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
            poolTableName={poolTableName}
            customerName={customerName}
            orderBy={reOrderBy}
            notes={notes}
            title="reprint order menu"
            ref={orderRef}
          />
        </ScrollArea>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => handleCloseAutoFocus()}>
            Close
          </Button>
          <Button onClick={handleOrderPrint}>
            <Printer className="mr-2 size-4" />
            Reprint
          </Button>
        </div>
      </div>
    </WrapperDialog>
  )
}
