import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import type { Metadata } from "next"
import { CafeOnlyTab } from "./cafe-only-tab"
import { PoolTableTab } from "./pool-table-tab"

export const metadata: Metadata = {
  title: "Tables",
}

export default async function Page() {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    session.user.role ?? "",
  )
  const cashierAccessLevel = ["DEWA", "ADMIN", "CASHIER"].includes(
    session.user.role ?? "",
  )

  return (
    <Tabs defaultValue="pool" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="pool">Pools</TabsTrigger>
        <TabsTrigger value="cafe-only" className="relative">
          Cafe Only
          {/* <OpenStatusCounter /> */}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pool">
        <PoolTableTab
          managerAccessLevel={managerAccessLevel}
          cashierAccessLevel={cashierAccessLevel}
        />
      </TabsContent>
      <TabsContent value="cafe-only" className="relative">
        <CafeOnlyTab
          managerAccessLevel={managerAccessLevel}
          cashierAccessLevel={cashierAccessLevel}
        />
      </TabsContent>
    </Tabs>
  )
}
