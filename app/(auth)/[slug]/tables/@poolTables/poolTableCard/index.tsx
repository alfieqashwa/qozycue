import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { DescriptionTable } from "./description-table"
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
          {order.status === "success" && (
            <Timer poolTable={poolTable} order={order.data} />
          )}
          <DescriptionTable
            poolTable={poolTable}
            orderStatusSucceed={order.status === "success"}
            order={order.data}
          />
        </section>
      </div>
    </div>
  )
}
