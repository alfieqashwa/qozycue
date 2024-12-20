import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  overview,
  detail,
}: Readonly<{ overview: React.ReactNode; detail: React.ReactNode }>) {
  const token = await convexAuthNextjsToken()
  const session = await fetchQuery(api.sessions.find, {}, { token })

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
    <Tabs defaultValue="overview" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="detail">Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Suspense fallback={<SkeletonDashboardCard />}>{overview}</Suspense>
      </TabsContent>
      <TabsContent value="detail">
        <Suspense fallback={<SkeletonDashboardCard />}>{detail}</Suspense>
      </TabsContent>
    </Tabs>
  )
}
