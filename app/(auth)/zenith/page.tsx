import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Zenith",
}

export default function ZenithPage() {
  return (
    <Tabs defaultValue="main-dashboard">
      <TabsList className="mb-2">
        <TabsTrigger value="main-dashboard">Main Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="main-dashboard">Dashboard Tab</TabsContent>
    </Tabs>
  )
}
