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
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )
  if (!user) redirect("/signin")

  const company = await fetchQuery(
    api.companies.find,
    { id: user.companyId },
    { token: convexAuthNextjsToken() },
  )

  if (user.role === "MANAGER")
    redirect(`/${encodeURIComponent(company?.slug as string)}/transactions/`)
  if (user.role === "CASHIER")
    redirect(`/${encodeURIComponent(company?.slug as string)}/tables/`)

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
