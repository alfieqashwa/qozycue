import { OrderlineDetail } from "@/components/orderline-detail"
import { PoolRentalDetail } from "@/components/pool-rental-detail"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { TransferTable } from "./transfer-table"
import { UpdateCustomerInfo } from "./update-customer-info"

type DetailButtonProps = {
  isCashier?: boolean
  isManager?: boolean
  orderId?: Id<"orders">
  customerName?: string
  customerPhone?: string | null
  orderStatus: "pending" | "error" | "success"
  order:
    | FunctionReturnType<typeof api.orders.findByPoolTableId>
    | FunctionReturnType<typeof api.orders.findById>
    | undefined
  children: React.ReactNode
}
export function DetailButton({
  isCashier,
  isManager,
  orderId,
  customerName,
  customerPhone,
  orderStatus,
  order,
  children,
}: DetailButtonProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const { data: poolTable } = useQuery({
    ...convexQuery(api.poolTables.findById, {
      poolTableId: order?.poolRental.poolTableId,
    }),
    enabled: !!order?.poolRental.poolTableId,
  })

  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      {children}
      <DrawerContent className="bg-card mx-auto max-w-xl min-w-[360px] cursor-grabbing px-6">
        <DrawerHeader className="flex flex-row items-center justify-between px-0">
          {!!order?.poolRental ? (
            <div className="flex flex-col items-start">
              <DrawerTitle
                className={cn(
                  "text-base whitespace-nowrap md:text-lg",
                  order.poolRental.packet?.rate === "HOUR"
                    ? "text-sky-400"
                    : "text-amber-300",
                )}
              >
                Table {poolTable?.name}
              </DrawerTitle>
              <DrawerDescription className="text-xs font-medium">
                Order ID: {order._id?.slice(-8)}
              </DrawerDescription>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <DrawerTitle className="text-base whitespace-nowrap text-fuchsia-300 md:text-lg">
                Cafe Only
              </DrawerTitle>
              <DrawerDescription className="text-xs font-medium">
                Order ID: {orderId?.slice(-8)}
              </DrawerDescription>
            </div>
          )}
          {order?._id && (
            <UpdateCustomerInfo
              orderId={order._id}
              customerName={order?.customer.name ?? customerName}
              customerPhone={order?.customer.phone || customerPhone}
              statusPayment={order.statusPayment as StatusPayment}
            />
          )}
        </DrawerHeader>
        <Tabs defaultValue={`${!!order?.poolRental._id ? "table" : "cafe"}`}>
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger
                value="table"
                disabled={!order?.poolRental._id}
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                value="cafe"
                disabled={!order?.orderlinesLen}
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Cafe
              </TabsTrigger>
            </TabsList>
            {!!order?.poolRental && poolTable?.isActive && (
              <TransferTable
                isCashier={isCashier!}
                isManager={isManager!}
                orderId={order._id!}
                packetRate={order?.poolRental.packet.rate}
                duration={order?.poolRental?.duration}
                poolTableIdFrom={poolTable._id}
                poolTableName={poolTable.name}
                startTime={poolTable.startTime!}
                endTime={poolTable.endTime}
                poolRentalId={order.poolRental._id!}
                setOpenDetailDrawer={setOpen}
                pathname={pathname}
              />
            )}
          </div>
          <TabsContent value="table">
            {orderStatus === "success" && (
              <PoolRentalDetail
                isActive={poolTable?.isActive!}
                packetName={order?.poolRental.packet.name}
                packetCost={order?.poolRental.packet.cost}
                packetRate={order?.poolRental.packet.rate}
                duration={order?.poolRental?.duration}
                totalCost={order?.poolRental?.totalCost}
                startTime={order?.poolRental?.timeStart}
                endTime={order?.poolRental?.timeEnd}
                poolRentalId={order?.poolRental?._id}
                createdBy={order?.createdBy?.name}
                createdAt={order?.poolRental?._creationTime}
              />
            )}
          </TabsContent>
          <TabsContent value="cafe">
            <OrderlineDetail orderId={order?._id} />
          </TabsContent>
        </Tabs>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
