"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { PoolTableCardPublic } from "./pool-table-card-public"
import { type ICountry } from "@/types"
import { countries } from "@/lib/countries"

export function PoolTableList({
  companyId,
  companyName,
  companyPhone,
}: {
  companyId: Id<"companies">
  companyName: string
  companyPhone: string
}) {
  const [
    { data: poolTables, status },
    { data: company, status: companyStatus },
  ] = useTanstackQueries({
    queries: [
      {
        ...convexQuery(api.poolTables.findAllPublicProcedure, {
          companyId,
        }),
        enabled: Boolean(companyId),
      },
      {
        ...convexQuery(api.companies.find, { id: companyId }),
        enabled: Boolean(companyId),
      },
    ],
  })

  const country = countries.find(
    (c) => c.code === (company?.countryCode as string),
  ) as ICountry

  return (
    <div className="mb-11 grid w-full grid-cols-1 gap-6 bg-zinc-950 p-2 font-mono sm:gap-8 md:mb-6 md:p-8 lg:grid-cols-2 2xl:grid-cols-3">
      {poolTables?.map((t) => {
        if (status !== "success" || companyStatus !== "success") {
          return (
            <SkeletonDashboardCard
              key={t._id}
              className="h-44 w-full rounded-2xl"
            />
          )
        }

        return (
          <PoolTableCardPublic
            companyName={companyName}
            companyPhone={companyPhone}
            isActive={t.isActive}
            poolTableId={t._id}
            poolTableName={t.name}
            poolTableStartTime={t.startTime as number}
            poolTableEndTime={t.endTime as number}
            locale={country.locale}
            key={t._id}
          />
        )
      })}
    </div>
  )
}
