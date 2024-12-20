import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { ArchiveOrderTab } from "./archive-order-tab"

export const metadata: Metadata = {
  title: "Archives",
}

export default async function ArchivePage() {
  const token = await convexAuthNextjsToken()
  const preloadSession = await preloadQuery(api.sessions.find, {}, { token })
  return (
    <Tabs defaultValue="archive" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="archive">Archives</TabsTrigger>
      </TabsList>
      <TabsContent value="archive">
        <ArchiveOrderTab preloadSession={preloadSession} />
      </TabsContent>
    </Tabs>
  )
}
