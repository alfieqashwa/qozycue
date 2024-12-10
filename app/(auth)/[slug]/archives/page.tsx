import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { ArchiveOrderTab } from "./archive-order-tab"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Archives",
}

export default async function ArchivePage() {
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!user) redirect("/signin")

  const managerAndCashierAccessLevel = [
    "ADMIN",
    "DEWA",
    "MANAGER",
    "CASHIER",
  ].includes(user.role ?? "")

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
