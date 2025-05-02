"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
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

  const country = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  )

  if (status !== "success" || company.status !== "success" || !country)
    return <SkeletonDashboardCard className="h-[700px]" />

  const { locale, currency } = country
  return (
    <PacketTable data={packets} columns={columnsPacket(locale, currency)} />
  )
}
