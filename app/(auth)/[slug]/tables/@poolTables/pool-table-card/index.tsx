import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { CafeButton } from "./cafe-button"
import { DescriptionTable } from "./description-table"
import { DetailButton } from "./detail-button"
import { PaymentButton } from "./payment-button"
import { StartTimerButton } from "./start-timer-button"
import { StopTimerButton } from "./stop-timer-button"
import { TimeDisplay } from "./time-display"
import { Timer } from "./timer"

export function PoolTableCard({
  poolTable,
}: {
  poolTable: FunctionReturnType<typeof api.pooltables.findAll>[0]
}) {
  const order = useTanstackQuery(
    convexQuery(api.orders.findByPoolTableId, { poolTableId: poolTable._id }),
  )

  return (
    <div className="group relative">
      <div
        className={cn(
          "group-transition-colors absolute -inset-[1px] h-44 w-full rounded-2xl duration-500 ease-in-out",
          !poolTable.isActive &&
            !poolTable.startTime &&
            !poolTable.endTime &&
            "bg-primary/10 blur-md group-hover:bg-primary/20 group-hover:shadow-lg group-hover:blur-lg",
          poolTable.isActive &&
            poolTable.startTime &&
            "bg-sky-400 blur-md group-hover:blur-lg",
          !poolTable.isActive &&
            !!poolTable.startTime &&
            "bg-amber-300 blur-sm group-hover:blur-md",
        )}
      />
      <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70% p-3 shadow">
        {/* <pre>{JSON.stringify(poolTable, null, 2)}</pre> */}
        <section className="flex justify-between">
          <Timer poolTable={poolTable} order={order.data} />
          <DescriptionTable
            poolTable={poolTable}
            orderStatusSucceed={order.status === "success"}
            order={order.data}
          />
          <TimeDisplay
            startTime={poolTable.startTime}
            endTime={poolTable.endTime}
          />
        </section>

        {/* === STARTS LIST_BUTTON === */}
        <section className="absolute bottom-2.5 left-1/2 w-full -translate-x-1/2 font-sans">
          <div className="mx-2 flex justify-between sm:mx-3">
            <DetailButton
              poolTable={poolTable}
              orderStatus={order.status}
              order={order.data}
            />
            {poolTable.isActive === false &&
            !poolTable.startTime &&
            !poolTable.endTime ? (
              <StartTimerButton
                // isCashier={isCashier}
                poolTableId={poolTable._id}
                poolTableName={poolTable.name}
                gapDuration={poolTable.gapDuration}
              />
            ) : poolTable.isActive === true && !!poolTable.startTime ? (
              <StopTimerButton
                // isCashier={isCashier}
                poolTableId={poolTable._id}
                poolTableName={poolTable.name}
                startTime={poolTable.startTime}
                poolRentalId={order.data?.poolRental?._id}
                packetCost={order.data?.packet?.cost}
                packetRate={order.data?.packet?.rate}
              />
            ) : (
              <PaymentButton
                // isCashier={isCashier}
                orderId={order.data?._id}
                statusPayment={order?.data?.statusPayment!}
                poolTableName={poolTable.name}
                customerName={order.data?.customer?.name}
                customerPhone={order.data?.customer?.phone}
                totalCost={order.data?.poolRental?.totalCost}
              />
            )}
            <CafeButton order={order.data} />
          </div>
        </section>
        {/* === ENDS LIST_BUTTON === */}
      </div>
    </div>
  )
}
