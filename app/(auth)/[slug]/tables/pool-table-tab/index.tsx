"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { PoolTableCard } from "./pool-table-card"

export function PoolTableTab({
  preloadedSession,
}: {
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const { user } = usePreloadedQuery(preloadedSession)
  const managerAccessLevel = ["ZENITH", "ADMIN", "MANAGER"].includes(
    user.role ?? "",
  )
  const cashierAccessLevel = ["ZENITH", "ADMIN", "CASHIER"].includes(
    user.role ?? "",
  )

  const { data: sortedPoolTableList, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    select(data) {
      return data
        .filter((p) => p.status === "enabled")
        .sort((p, q) =>
          p.name.localeCompare(q.name, undefined, { numeric: true }),
        )
    },
  })

  const company = useTanstackQuery({
    ...convexQuery(api.companies.find, { id: user.companyId }),
    enabled: Boolean(user.companyId),
  })

  const country = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  )

  return (
    <div className="relative">
      <div className="grid w-full grid-cols-1 gap-6 font-mono sm:gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        {sortedPoolTableList?.map((t) => {
          if (status !== "success")
            return (
              <SkeletonDashboardCard
                key={t._id}
                className="h-44 w-full rounded-2xl"
              />
            )
          return (
            <PoolTableCard
              managerAccessLevel={managerAccessLevel}
              cashierAccessLevel={cashierAccessLevel}
              isPublished={t.company.isPublished}
              isActive={t.isActive}
              poolTableId={t._id}
              poolTableName={t.name}
              poolTableStartTime={t.startTime as number}
              poolTableEndTime={t.endTime as number}
              gapDuration={t.gapDuration as number}
              country={country as ICountry}
              key={t._id}
            />
          )
        })}
      </div>
    </div>
  )
}
