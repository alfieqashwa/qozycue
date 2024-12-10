import { Button } from "@/components/ui/button"
import { DrawerTrigger } from "@/components/ui/drawer"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { ScrollText } from "lucide-react"
import { Booking } from "./booking"
import { CafeButton } from "./cafe-button"
import { DescriptionTable } from "./description-table"
import { DetailButton } from "./detail-button"
import { PaymentButton } from "./payment-button"
import { PendingStatusCounter } from "./pending-status-counter"
import { StartTimerButton } from "./start-timer-button"
import { StopTimerButton } from "./stop-timer-button"
import { TimeDisplay } from "./time-display"
import { Timer } from "./timer"
import { Countdown } from "./timer/count-down"
import { Stopwatch } from "./timer/stopwatch"

export function PoolTableCard({
  managerAccessLevel,
  cashierAccessLevel,
  isPublished,
  poolTableId,
  poolTableName,
  poolTableStartTime,
  poolTableEndTime,
  isActive,
  gapDuration,
}: {
  managerAccessLevel: boolean
  cashierAccessLevel: boolean
  isPublished?: boolean
  poolTableId: Id<"poolTables">
  poolTableName: string
  poolTableStartTime: number
  poolTableEndTime: number
  isActive: boolean
  gapDuration: number
}) {
  const order = useTanstackQuery({
    ...convexQuery(api.orders.findByPoolTableId, {
      poolTableId,
    }),
    enabled: Boolean(poolTableId),
  })
  return (
    <div className="group relative">
      <PendingStatusCounter
        poolTableId={poolTableId}
        poolTableName={poolTableName}
        companyId={order.data?.companyId}
      />
      {/*  Only show if the packet-rate is hourly or undefined */}
      {isPublished && order.data?.poolRental.packet.rate !== "MINUTE" && (
        <Booking
          isCashier={cashierAccessLevel}
          poolTableId={poolTableId}
          poolTableName={poolTableName}
          gapDuration={gapDuration}
          openAndNotBookingOrderId={order.data?._id}
        />
      )}
      <div
        className={cn(
          "group-transition-colors absolute -inset-[1px] h-44 w-full rounded-2xl duration-500 ease-in-out",
          "blur-md group-hover:blur-lg",
          {
            "bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-lg":
              !isActive && !poolTableStartTime && !poolTableEndTime,
            "bg-sky-400": isActive && poolTableStartTime,
            "bg-amber-300 blur-sm group-hover:blur-md":
              !isActive && !!poolTableStartTime,
          },
        )}
      />
      <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70% p-3 shadow">
        <section className="flex justify-between">
          <Timer
            isCashier={cashierAccessLevel}
            isActive={isActive}
            poolTableId={poolTableId}
            poolTableName={poolTableName}
            orderId={order.data?._id}
            hasStartTime={!!poolTableStartTime}
            hasEndTime={!!poolTableEndTime}
          >
            {order.status === "success" &&
              order.data?.poolRental?.packet.rate === "HOUR" && (
                <Countdown
                  endTime={poolTableEndTime}
                  poolTableId={poolTableId}
                  poolTableName={poolTableName}
                  poolRentalId={order.data.poolRental._id}
                  startTime={poolTableStartTime}
                  packetCost={order.data.poolRental.packet.cost}
                  packetRate={order.data.poolRental.packet.rate}
                  duration={order.data?.poolRental?.duration}
                />
              )}
            {order.status === "success" &&
              order.data?.poolRental?.packet.rate === "MINUTE" && (
                <Stopwatch
                  isActive={isActive}
                  poolTableId={poolTableId}
                  poolTableName={poolTableName}
                  poolRentalId={order.data.poolRental._id}
                  startTime={poolTableStartTime}
                  packetCost={order.data.poolRental.packet.cost}
                  packetRate={order.data.poolRental.packet.rate}
                />
              )}
          </Timer>
          <DescriptionTable
            isActive={isActive}
            startTime={poolTableStartTime}
            poolTableName={poolTableName}
            orderStatusSucceed={order.status === "success"}
            packetName={order.data?.poolRental?.packet.name}
            packetCost={order.data?.poolRental?.packet.cost}
            packetRate={order.data?.poolRental?.packet.rate}
            duration={order.data?.poolRental?.duration}
            totalCost={order.data?.poolRental?.totalCost}
          />
          <TimeDisplay
            startTime={poolTableStartTime}
            endTime={poolTableEndTime}
          />
        </section>

        {/* === STARTS LIST_BUTTON === */}
        <section className="absolute bottom-2.5 left-1/2 w-full -translate-x-1/2 font-sans">
          <div className="mx-2 flex justify-between sm:mx-3">
            <DetailButton
              isCashier={cashierAccessLevel}
              orderStatus={order.status}
              order={order.data}
            >
              <DrawerTrigger asChild>
                <Button
                  // TODOS: FUCKIN' DISABLED
                  disabled={!order.data?._id}
                  variant="secondary"
                  className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <ScrollText size={20} />
                  <span>Detail</span>
                </Button>
              </DrawerTrigger>
            </DetailButton>
            {isActive === false && !poolTableStartTime && !poolTableEndTime ? (
              <StartTimerButton
                isCashier={cashierAccessLevel}
                poolTableId={poolTableId}
                poolTableName={poolTableName}
                gapDuration={gapDuration}
              />
            ) : isActive === true && !!poolTableStartTime ? (
              <StopTimerButton
                isCashier={cashierAccessLevel}
                poolTableId={poolTableId}
                poolTableName={poolTableName}
                startTime={poolTableStartTime}
                poolRentalId={order.data?.poolRental?._id}
                packetCost={order.data?.poolRental.packet?.cost}
                packetRate={order.data?.poolRental.packet?.rate}
              />
            ) : (
              <PaymentButton
                isCashier={cashierAccessLevel}
                orderId={order.data?._id}
                poolTableName={poolTableName}
                customerName={order.data?.customer?.name}
                customerPhone={order.data?.customer?.phone}
                totalCost={order.data?.poolRental?.totalCost}
              />
            )}
            <CafeButton
              isManager={managerAccessLevel}
              isCashier={cashierAccessLevel}
              order={order.data}
              poolTableName={poolTableName}
            />
          </div>
        </section>
        {/* === ENDS LIST_BUTTON === */}
      </div>
    </div>
  )
}
