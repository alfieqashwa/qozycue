import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { TabsContent } from "@/components/ui/tabs"
import { Suspense } from "react"
import Overview from "./overview"
import Detail from "./detail"

export default function DashboardPage() {
  return (
    <>
      <TabsContent value="overview">
        <Suspense fallback={<SkeletonDashboardCard />}>
          <Overview />
        </Suspense>
      </TabsContent>
      <TabsContent value="detail">
        <Suspense fallback={<SkeletonDashboardCard />}>
          <Detail />
        </Suspense>
      </TabsContent>
    </>
  )
}
