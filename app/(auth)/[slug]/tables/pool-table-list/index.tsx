"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { PoolTableCard } from "./pool-table-card"

export function PoolTableList({
  managerAccessLevel,
  cashierAccessLevel,
}: {
  managerAccessLevel: boolean
  cashierAccessLevel: boolean
}) {
  const { data: sortedPoolTableList, status } = useQuery({
    ...convexQuery(api.pooltables.findAll, {}),
    select(data) {
      return data
        .filter((p) => p.status === "enabled")
        .sort((p, q) =>
          p.name.localeCompare(q.name, undefined, { numeric: true }),
        )
    },
  })
  return (
    <div className="relative">
      <div className="grid w-full grid-cols-1 gap-6 font-mono sm:gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        {sortedPoolTableList?.map((poolTable) => {
          if (status !== "success")
            return (
              <SkeletonDashboardCard
                key={poolTable._id}
                className="h-44 w-full rounded-2xl"
              />
            )
          return (
            <PoolTableCard
              managerAccessLevel={managerAccessLevel}
              cashierAccessLevel={cashierAccessLevel}
              poolTable={poolTable}
              key={poolTable._id}
            />
          )
        })}
      </div>
    </div>
  )
}
