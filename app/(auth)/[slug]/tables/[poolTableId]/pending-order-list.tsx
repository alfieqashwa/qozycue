"use client"

import { OrderlineDetail } from "@/components/orderline-detail"
import { PoolRentalDetail } from "@/components/pool-rental-detail"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { User2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CafeButton } from "../pool-table-list/pool-table-card/cafe-button"
import { PaymentButton } from "../pool-table-list/pool-table-card/payment-button"

type PendingOrderListProps = {
  poolTableId: Id<"poolTables">
  poolTableName: string
  slug: string
  isManager: boolean
  isCashier: boolean
}
export function PendingOrderList({
  poolTableId,
  poolTableName,
  slug,
  isManager,
  isCashier,
}: PendingOrderListProps) {
  const router = useRouter()

  const pendingOrderList = useQuery({
    ...convexQuery(api.orders.findAllPendingStatusByPoolTableId, {
      poolTableId,
    }),
    enabled: Boolean(poolTableId),
  })

  useEffect(() => {
    if (!pendingOrderList.data?.length) {
      router.push(`/${encodeURIComponent(slug)}/tables/`)
    }
  }, [pendingOrderList.data?.length, router, slug])

  return (
    <div className="mt-4 grid min-w-max grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
      {pendingOrderList.status === "success" &&
        pendingOrderList.data.map((order) => (
          <PendingOrderCard
            poolTableId={poolTableId}
            poolTableName={poolTableName}
            isManager={isManager}
            isCashier={isCashier}
            order={order}
            key={order._id}
          />
        ))}
    </div>
  )
}

type PendingOrderCardProps = Omit<PendingOrderListProps, "slug"> & {
  order: FunctionReturnType<
    typeof api.orders.findAllPendingStatusByPoolTableId
  >[0]
}
const PendingOrderCard = ({
  poolTableId,
  poolTableName,
  isManager,
  isCashier,
  order,
}: PendingOrderCardProps) => (
  <section
    className="rounded-2xl border-2 bg-card p-4 shadow-lg"
    key={order._id}
  >
    <div className="flex justify-between space-x-2 text-sm font-medium tracking-widest">
      <h2 className="text-foreground">Table {poolTableName}</h2>
      <h2 className="capitalize text-muted-foreground">
        <User2 size={16} className="mr-1 inline-block" />
        {order.customer.name}
      </h2>
    </div>
    <Tabs defaultValue="table">
      <TabsList className="mt-3">
        <TabsTrigger
          value="table"
          disabled={!order.poolRental}
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Table
        </TabsTrigger>
        <TabsTrigger
          value="cafe"
          disabled={!order.orderlinesLen}
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Cafe
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        {!!order.poolRental && (
          <PoolRentalDetail
            isActive={false}
            createdBy={order.createdBy.name}
            packetName={order.poolRental.packet.name}
            packetCost={order.poolRental.packet.cost}
            packetRate={order.poolRental.packet.rate}
            duration={order.poolRental.duration}
            totalCost={order.poolRental.totalCost}
            timeStart={order.poolRental.timeStart}
            timeEnd={order.poolRental.timeEnd!}
            poolRentalId={order.poolRental._id}
            createdAt={order.poolRental._creationTime}
          />
        )}
      </TabsContent>
      <TabsContent value="cafe">
        <OrderlineDetail orderId={order._id} />
      </TabsContent>
    </Tabs>

    <div className="mt-4 flex items-center justify-between">
      {/* === STARTS Cafe Button === */}

      <CafeButton
        isManager={isManager}
        isCashier={isCashier}
        order={order}
        poolTableId={poolTableId}
        poolTableName={poolTableName}
      />
      {/* === ENDS Cafe Button === */}
      <div className="flex items-center space-x-2">
        <PaymentButton
          isCashier={isCashier}
          orderId={order._id}
          poolTableName={poolTableName}
          customerName={order.customer.name}
          customerPhone={order.customer.phone}
          totalCost={order.poolRental.totalCost}
        />
      </div>
    </div>
  </section>
)
