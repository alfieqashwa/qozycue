import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Detail from "./detail"
import Overview from "./overview"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: await convexAuthNextjsToken() },
  )

  if (!session) redirect("/signin")
  if (session.user.role === "MANAGER")
    redirect(
      `/${encodeURIComponent(session.user.company?.slug as string)}/transactions/`,
    )
  if (session.user.role === "CASHIER")
    redirect(
      `/${encodeURIComponent(session.user.company?.slug as string)}/tables/`,
    )
  return (
    <Tabs defaultValue="overview" className="relative">
      <TabsList className="mb-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="detail">Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Suspense fallback={<SkeletonDashboardCard />}>
          <ScrollArea className="h-[calc(100vh_-_9.3rem)] scroll-smooth">
            <Overview />
          </ScrollArea>
        </Suspense>
      </TabsContent>
      <TabsContent value="detail">
        <Suspense fallback={<SkeletonDashboardCard />}>
          <Detail />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
