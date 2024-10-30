import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function Page() {
  return (
    <Tabs defaultValue="transactions" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="transactions">Transactions Content</TabsContent>
    </Tabs>
  )
}
