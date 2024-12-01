"use client"

import { SkeletonDashboardCard } from "~/app/_components/skeleton-dashboard-card"
import { api } from "~/trpc/react"
import { PoolTableCardPublic } from "./pool-table-card-public"

export function PoolTableList({
  companyId,
  companyName,
  companyPhone,
}: {
  companyId: string
  companyName: string
  companyPhone: string
}) {
  const { data: poolTables, status } =
    api.poolTable.findAllByCompanyIdPublic.useQuery(
      { companyId },
      { enabled: Boolean(companyId), refetchInterval: 1000 * 10 },
    )
  return (
    <div className="grid w-full grid-cols-1 gap-6 p-2 font-mono sm:gap-8 md:p-8 lg:grid-cols-2 2xl:grid-cols-3">
      {poolTables?.map((t) => {
        if (status !== "success") {
          return (
            <SkeletonDashboardCard
              key={t.id}
              className="h-44 w-full rounded-2xl"
            />
          )
        }

        return (
          <PoolTableCardPublic
            companyId={companyId}
            companyName={companyName}
            companyPhone={companyPhone}
            isActive={t.isActive}
            poolTableId={t.id}
            poolTableName={t.name}
            poolTableStartTime={t.startTime as Date}
            poolTableEndTime={t.endTime as Date}
            key={t.id}
          />
        )
      })}
    </div>
  )
}
