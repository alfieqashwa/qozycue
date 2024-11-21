import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { ArchiveOrderTab } from "./archive-order-tab"

export const metadata: Metadata = {
  title: "Archives",
}

export default async function ArchivePage() {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  const managerAndCashierAccessLevel = [
    "ADMIN",
    "DEWA",
    "MANAGER",
    "CASHIER",
  ].includes(session.user.role ?? "")

  return (
    <Tabs defaultValue="archive" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="archive">Archives</TabsTrigger>
      </TabsList>
      <TabsContent value="archive">
        <ArchiveOrderTab
          disabledBasedOnAccessLevel={!managerAndCashierAccessLevel}
        />
      </TabsContent>
    </Tabs>
  )
}
