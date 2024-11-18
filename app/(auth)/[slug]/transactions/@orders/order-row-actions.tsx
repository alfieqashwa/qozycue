"use client"

import { PrintReceipt } from "@/components/print-receipt"
import { Button } from "@/components/ui/button"
import { DrawerTrigger } from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Copy, Printer, ScrollText } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { DetailButton } from "../../tables/pool-table-list/pool-table-card/detail-button"
import { ArchiveOrder } from "./archive-order"
import { UpdateCustomer } from "./update-customer"

export function OrderRowActions({
  orderId,
  statusPayment,
  customerName,
  customerPhone,
  createdBy,
}: {
  orderId: Id<"orders">
  statusPayment: StatusPayment
  customerName?: string
  customerPhone?: string | null
  createdBy?: string | null
}) {
  const [open, setOpen] = useState(false)

  const { data: order, status: orderStatus } = useTanstackQuery({
    ...convexQuery(api.orders.findById, { id: orderId, notEqual: "ARCHIVE" }),
    enabled: Boolean(orderId),
  })

  const { data: me, status } = useTanstackQuery({
    ...convexQuery(api.users.me, {}),
  })
  const managerAndCashierAccessLevel =
    me?.role === "MANAGER" ||
    me?.role === "CASHIER" ||
    me?.role === "ADMIN" ||
    me?.role === "DEWA"

  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `order_receipt_${order?._id?.slice(-8, order?._id.length)}`,
    onPrintError: () => alert("there is an error when printing receipt."),
    // pageStyle: "@page { margin-top: 10mm; }",
  })

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
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
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
          <span>Copy ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* //! I remove DropdownMenuItem because bug: cannot input space-bar when edit the input form */}
        {/* <DropdownMenuItem
          className="group"
          onSelect={(e) => e.preventDefault()}
        > */}
        <UpdateCustomer
          orderId={orderId}
          statusPayment={statusPayment}
          customerName={customerName}
          customerPhone={customerPhone}
          setOpen={setOpen}
        />
        {/* </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          onSelect={(e) => e.preventDefault()}
        >
          <DetailButton orderStatus={orderStatus} order={order}>
            <DrawerTrigger className="group flex w-full items-center text-sm disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground">
              <ScrollText className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
              <span>Detail</span>
            </DrawerTrigger>
          </DetailButton>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {statusPayment === "PAID" && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="hidden">
              <PrintReceipt
                orderId={orderId}
                customerName={customerName}
                ref={componentRef}
              />
            </div>
            <button
              onClick={handlePrint}
              className="flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground"
            >
              <Printer className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
              <span>Receipt</span>
            </button>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator
          className={cn(statusPayment !== "PAID" && "hidden")}
        />
        {status === "success" && !!managerAndCashierAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <ArchiveOrder
              orderId={orderId}
              statusPayment={statusPayment}
              setOpen={setOpen}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
