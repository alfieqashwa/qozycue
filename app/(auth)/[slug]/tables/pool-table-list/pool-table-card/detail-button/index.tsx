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
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { Phone, ScrollText, User2 } from "lucide-react"
import { useState } from "react"
import { TransferTable } from "./transfer-table"

export function DetailButton({
  isCashier,
  poolTable,
  orderStatus,
  order,
}: {
  isCashier: boolean
  poolTable: FunctionReturnType<typeof api.pooltables.findAll>[0]
  orderStatus: "pending" | "error" | "success"
  order: FunctionReturnType<typeof api.orders.findByPoolTableId> | undefined
}) {
  const orderlines = useTanstackQuery(
    convexQuery(api.orderlines.findAllByOrderId, { orderId: order?._id }),
  )
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          disabled={!order}
          variant="secondary"
          className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <ScrollText size={20} />
          <span>Detail</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto min-w-[360px] max-w-xl bg-card px-6">
        <DrawerHeader className="flex justify-between px-0">
          {!!order?.poolRental ? (
            <div className="flex flex-col items-start">
              <DrawerTitle
                className={cn(
                  "whitespace-nowrap text-base md:text-lg",
                  order.packet?.rate === "HOUR"
                    ? "text-sky-400"
                    : "text-amber-300",
                )}
              >
                Table {poolTable.name}
              </DrawerTitle>
              <DrawerDescription className="text-xs font-medium">
                Order ID: {order._id?.slice(-8)}
              </DrawerDescription>
            </div>
          ) : (
            <DrawerTitle className="whitespace-nowrap text-base md:text-lg">
              Cafe Only
            </DrawerTitle>
          )}
          <div className="space-y-1">
            <DrawerDescription className="flex space-x-2 capitalize">
              <User2 size={16} />
              <span className="font-medium text-foreground">
                {order?.customer?.name}
              </span>
            </DrawerDescription>
            {order?.customer?.phone && (
              <DrawerDescription className="flex space-x-2 text-xs capitalize">
                <Phone size={16} />
                <span className="font-medium tracking-wider text-muted-foreground">
                  {order.customer.phone}
                </span>
              </DrawerDescription>
            )}
          </div>
        </DrawerHeader>
        <Tabs defaultValue={`${!!order?.poolRental ? "table" : "cafe"}`}>
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger
                value="table"
                disabled={!order?.poolRental}
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                value="cafe"
                disabled={!!orderlines.data?.length}
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Cafe
              </TabsTrigger>
            </TabsList>
            {!!order?.poolRental && poolTable.isActive && (
              <TransferTable
                isCashier={isCashier}
                orderId={order._id!}
                poolTableIdFrom={poolTable._id}
                poolTableName={poolTable.name}
                startTime={poolTable.startTime}
                endTime={poolTable.endTime}
                poolRentalId={order.poolRental._id}
                setOpenDetailDrawer={setOpen}
              />
            )}
          </div>
          <TabsContent value="table">
            {orderStatus === "success" && (
              <PoolRentalDetail
                isActive={poolTable.isActive}
                packetName={order?.packet?.name}
                packetCost={order?.packet?.cost}
                packetRate={order?.packet?.rate}
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
            {orderlines.status === "success" && (
              <OrderlineDetail orderlines={orderlines.data} />
            )}
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
