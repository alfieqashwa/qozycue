"use client"

import { PrintReceipt } from "@/components/print-receipt"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { StatusPayment } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Copy, Printer } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

export function OrderRowActions({
  orderId,
  statusPayment,
  poolTableName,
  customerName,
}: {
  orderId: Id<"orders">
  statusPayment: StatusPayment
  poolTableName?: string
  customerName?: string
}) {
  const [open, setOpen] = useState(false)

  const { data: order } = useTanstackQuery({
    ...convexQuery(api.orders.findById, { id: orderId }),
    enabled: Boolean(orderId),
  })

  const contentRef = useRef(null)
  const handlePrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `order_receipt_${order?._id?.slice(-8, order?._id.length)}`,
    onPrintError: () => alert("there is an error when printing receipt."),
    // pageStyle: "@page { margin-top: 10mm; }",
  })

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(orderId)}
          className="group hover:cursor-pointer"
        >
          <Copy className="text-muted-foreground/70 group-hover:text-primary" />
          <span>Copy ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {statusPayment === "PAID" && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="hidden">
              <PrintReceipt
                poolTableName={poolTableName!}
                orderId={orderId}
                customerName={customerName}
                ref={contentRef}
              />
            </div>
            <button
              onClick={() => handlePrintFn()}
              className="disabled:text-muted-foreground flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <Printer className="text-muted-foreground group-hover:text-primary mr-2 size-4" />
              <span>Receipt</span>
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
