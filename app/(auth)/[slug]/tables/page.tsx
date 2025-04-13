import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import CafeOnlyTab from "./cafe-only-tab"
import { OpenStatusCounter } from "./open-status-counter"
import { PoolTableTab } from "./pool-table-tab"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tables",
}

export default async function Page() {
  const token = await convexAuthNextjsToken()
  const preloadedSession = await preloadQuery(api.sessions.find, {}, { token })

  const session = preloadedQueryResult(preloadedSession)
  if (!session) redirect("/signin")

  return (
    <Tabs defaultValue="pool" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="pool">Pools</TabsTrigger>
        <TabsTrigger value="cafe-only" className="relative">
          Cafe Only
          <OpenStatusCounter />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pool">
        <PoolTableTab preloadedSession={preloadedSession} />
      </TabsContent>
      <TabsContent value="cafe-only" className="relative">
        <CafeOnlyTab preloadedSession={preloadedSession} />
      </TabsContent>
    </Tabs>
  )
}
