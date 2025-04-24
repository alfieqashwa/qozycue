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
          "inset-shadow-lg bg-primary/5 relative size-[6rem] shrink-0 rounded-full p-2",
          isActive &&
            "bg-primary/10 mx-1 ring-4 ring-offset-4 ring-offset-black",
          hasEndTime ? "ring-muted" : "ring-sky-400",
        )}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
