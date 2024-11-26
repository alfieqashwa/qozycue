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
}: Readonly<{ overview: React.ReactNode }>) {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )
  if (!session._id) redirect("/signin")
  if (session.user.role === "MANAGER")
    redirect(`/${encodeURIComponent(session.companySlug!)}/transactions/`)
  if (session.user.role === "CASHIER")
    redirect(`/${encodeURIComponent(session.companySlug!)}/tables/`)

  return (
    <Tabs defaultValue="overview" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="detail">Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Suspense fallback={<SkeletonDashboardCard />}>{overview}</Suspense>
      </TabsContent>
    </Tabs>
  )
}
