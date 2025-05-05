"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { countries } from "@/lib/countries"
import { countryCodeSchema } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { PoolTableCardPublic } from "./pool-table-card-public"

export function PoolTableList({
  companyId,
  companyName,
  companyPhone,
}: {
  companyId: Id<"companies">
  companyName: string
  companyPhone: string
}) {
  const [poolTables, company] = useTanstackQueries({
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

  const countryCodeParse = countryCodeSchema.safeParse(
    company.data?.countryCode,
  )

  const country = countryCodeParse.success
    ? countries.find((c) => c.code === countryCodeParse.data)
    : undefined

  const status = poolTables.status || company.status

  return (
    <div className="mb-11 grid w-full grid-cols-1 gap-6 bg-zinc-950 p-2 font-mono sm:gap-8 md:mb-6 md:p-8 lg:grid-cols-2 2xl:grid-cols-3">
      {poolTables.data?.map((t) => {
        if (!status || !country) {
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
