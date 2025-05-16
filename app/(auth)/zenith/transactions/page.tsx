import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function Page() {
  return (
    <Tabs defaultValue="transactions">
      <TabsList className="mb-2">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="transactions">Transactions Content</TabsContent>
    </Tabs>
  )
}
