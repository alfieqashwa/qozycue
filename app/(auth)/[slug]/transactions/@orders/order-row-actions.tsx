"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Copy } from "lucide-react"
import { useRef, useState } from "react"
// import { DetailButton } from "../../tables/pool-table-tab/pool-table-card/list-button/detail-button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { StatusPayment } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { useReactToPrint } from "react-to-print"
import { ArchiveOrder } from "./archive-order"

export function OrderRowActions({
  id,
  statusPayment,
  customerName,
  customerPhone,
  createdBy,
}: {
  id: Id<"orders">
  statusPayment: StatusPayment
  customerName?: string
  customerPhone?: string | null
  createdBy?: string | null
}) {
  const [open, setOpen] = useState(false)

  const { data: order } = useTanstackQuery({
    ...convexQuery(api.orders.findById, { id, notEqual: "ARCHIVE" }),
    enabled: Boolean(id),
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
          onClick={() => navigator.clipboard.writeText(id)}
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
        {/* <UpdateCustomer
          id={id}
          statusPayment={statusPayment}
          customerName={customerName}
          customerPhone={customerPhone}
          setOpen={setOpen}
        /> */}
        {/* </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          onSelect={(e) => e.preventDefault()}
        >
          {/* <DetailButton
            orderId={id}
            poolTableName={order?.poolTableName as string}
            isPoolRental={!!order?.poolRental}
            hasOrderlines={order?.hasOrderlines as boolean}
            customerName={customerName}
            customerPhone={customerPhone}
            drawerTrigger={
              <DrawerTrigger
                disabled={statusPayment === StatusPayment.OPEN}
                className="flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                <ScrollText className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span>Detail</span>
              </DrawerTrigger>
            }
          >
            <TabsContent value="table">
              <PoolRentalDetail
                isActive={false}
                createdBy={createdBy}
                packetName={order?.poolRental?.packet.name}
                packetCost={order?.poolRental?.packet.cost}
                packetRate={order?.poolRental?.packet.rate}
                duration={order?.poolRental?.duration}
                totalCost={order?.poolRental?.totalCost}
                timeStart={order?.poolRental?.timeStart}
                timeEnd={order?.poolRental?.timeEnd}
                poolRentalId={order?.poolRental?.id}
                createdAt={order?.poolRental?.createdAt}
              />
            </TabsContent>
            <TabsContent value="cafe">
              {!!order?.orderlines?.length && (
                <OrderlineDetail orderlines={order.orderlines} />
              )}
            </TabsContent>
          </DetailButton> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* {statusPayment === StatusPayment.PAID && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="hidden">
              <PrintReceipt
                orderId={id}
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
        )} */}
        <DropdownMenuSeparator
          className={cn(statusPayment !== "PAID" && "hidden")}
        />
        {status === "success" && !!managerAndCashierAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <ArchiveOrder
              id={id}
              statusPayment={statusPayment}
              setOpen={setOpen}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
