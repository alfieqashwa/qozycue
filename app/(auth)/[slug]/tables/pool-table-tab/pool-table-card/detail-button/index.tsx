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
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { Phone, User2 } from "lucide-react"
import { useState } from "react"
import { TransferTable } from "./transfer-table"

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

  const { data: poolTable } = useQuery({
    ...convexQuery(api.poolTables.findById, {
      poolTableId: order?.poolRental.poolTableId,
    }),
    enabled: !!order?.poolRental.poolTableId,
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
      <DrawerContent className="bg-card mx-auto max-w-xl min-w-[360px] px-6">
        <DrawerHeader className="flex justify-between px-0">
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
          <div className="space-y-1">
            <DrawerDescription className="flex space-x-2 capitalize">
              <User2 size={16} />
              <span className="text-foreground font-medium">
                {order?.customer.name ?? customerName}
              </span>
            </DrawerDescription>
            <DrawerDescription className="flex space-x-2 text-xs capitalize">
              <Phone size={16} />
              <span className="text-muted-foreground font-medium tracking-wider">
                {order?.customer.phone || customerPhone || "No phone"}
              </span>
            </DrawerDescription>
          </div>
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
