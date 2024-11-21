import { type Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getServerAuthSession } from "@/server/auth"
import { ArchiveOrderTab } from "./archive-order-tab"

export const metadata: Metadata = {
  title: "Archives",
}

export default async function ArchivePage() {
  const session = await getServerAuthSession()
  return (
    <Tabs defaultValue="archive" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="archive">Archives</TabsTrigger>
      </TabsList>
      <TabsContent value="archive">
        <ArchiveOrderTab session={session} />
      </TabsContent>
    </Tabs>
  )
}
