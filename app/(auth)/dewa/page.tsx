import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Dewa",
}

export default function DewaPage() {
  return (
    <Tabs defaultValue="main-dashboard" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="main-dashboard">Main Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="main-dashboard">Dashboard Tab</TabsContent>
    </Tabs>
  )
}
