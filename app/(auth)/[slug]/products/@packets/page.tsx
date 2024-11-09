import { Suspense } from "react"
import { SkeletonDashboardCard } from "@/app/_components/skeleton-dashboard-card"
import { api } from "@/trpc/server"
import { columnsPacket } from "./columns-packet"
import { PacketTable } from "./packet-table"

export default async function Page() {
  const packets = await api.packet.findAllByCompanyId()
  return (
    <Suspense fallback={<SkeletonDashboardCard className="h-[700px]" />}>
      <PacketTable data={packets} columns={columnsPacket} />
    </Suspense>
  )
}
