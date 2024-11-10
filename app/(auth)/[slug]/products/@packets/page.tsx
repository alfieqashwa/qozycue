"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsPacket } from "./columns-packet"
import { PacketTable } from "./packet-table"

export default function Page() {
  const { data: packets, status } = useTanstackQuery(
    convexQuery(api.packets.findAll, {}),
  )

  if (status !== "success")
    return <SkeletonDashboardCard className="h-[700px]" />
  return <PacketTable data={packets} columns={columnsPacket} />
}
