import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"

export function PoolTableCard({
  poolTable,
}: {
  poolTable: FunctionReturnType<typeof api.pooltables.findAll>[0]
}) {
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
        <pre>{JSON.stringify(poolTable, null, 2)}</pre>
      </div>
    </div>
  )
}
