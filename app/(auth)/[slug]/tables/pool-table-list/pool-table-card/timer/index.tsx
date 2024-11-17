import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { Countdown } from "./count-down"
import { ResetButton } from "./reset-button"
import { Stopwatch } from "./stopwatch"

export function Timer({
  isCashier,
  poolTable,
  order,
}: {
  isCashier: boolean
  poolTable: FunctionReturnType<typeof api.pooltables.findAll>[0]
  order: FunctionReturnType<typeof api.orders.findByPoolTableId> | undefined
}) {
  return (
    <div className="p-2">
      <div
        className={cn(
          "relative size-[6rem] shrink-0 rounded-full bg-zinc-900 p-2 shadow-md",
          poolTable.isActive && "mx-1 ring-4 ring-offset-4 ring-offset-black",
          !!poolTable.endTime ? "ring-muted" : "ring-sky-400",
        )}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {poolTable.isActive ? (
            order?.poolRental.packet?.rate === "HOUR" ? (
              <Countdown
                endTime={poolTable.endTime}
                poolTableId={poolTable._id}
                poolTableName={poolTable.name}
                poolRentalId={order?.poolRental?._id}
                startTime={poolTable.startTime}
                packetCost={order?.poolRental.packet?.cost}
                packetRate={order?.poolRental.packet?.rate}
                duration={order?.poolRental?.duration}
              />
            ) : (
              <Stopwatch
                isActive={poolTable.isActive}
                poolTableId={poolTable._id}
                poolTableName={poolTable.name}
                poolRentalId={order?.poolRental?._id}
                startTime={poolTable.startTime}
                packetCost={order?.poolRental.packet?.cost}
                packetRate={order?.poolRental.packet?.rate}
              />
            )
          ) : (
            <ResetButton
              poolTableId={poolTable._id}
              poolTableName={poolTable.name}
              orderId={order?._id}
              disabled={
                !isCashier || (!poolTable.startTime && !poolTable.endTime)
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
