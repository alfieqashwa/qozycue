import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { ResetButton } from "./reset-button"

export function Timer({
  isCashier,
  isActive,
  poolTableId,
  poolTableName,
  orderId,
  hasStartTime,
  hasEndTime,
  children,
}: {
  isCashier: boolean
  isActive: boolean
  poolTableId: Id<"poolTables">
  poolTableName: string
  orderId?: Id<"orders">
  hasStartTime: boolean
  hasEndTime: boolean
  children: React.ReactNode
}) {
  return (
    <div className="p-2">
      <div
        className={cn(
          "relative size-[6rem] shrink-0 rounded-full bg-zinc-900 p-2 shadow-md",
          isActive && "mx-1 ring-4 ring-offset-4 ring-offset-black",
          hasEndTime ? "ring-muted" : "ring-sky-400",
        )}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {isActive ? (
            children
          ) : (
            <ResetButton
              poolTableId={poolTableId}
              poolTableName={poolTableName}
              orderId={orderId}
              disabled={!isCashier || (!hasStartTime && !hasEndTime)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
