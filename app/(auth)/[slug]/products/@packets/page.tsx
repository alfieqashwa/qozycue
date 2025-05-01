"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { type ICountry } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsPacket } from "./columns-packet"
import { PacketTable } from "./packet-table"

export default function Page() {
  const { data: packets, status } = useTanstackQuery(
    convexQuery(api.packets.findAll, {}),
  )

  const company = useTanstackQuery({
    ...convexQuery(api.companies.find, { id: packets?.[0]?.companyId }),
    enabled: !!packets?.[0]?.companyId,
  })

  const { locale, currency } = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  ) as ICountry

  if (status !== "success")
    return <SkeletonDashboardCard className="h-[700px]" />
  return (
    <PacketTable data={packets} columns={columnsPacket(locale, currency)} />
  )
}
