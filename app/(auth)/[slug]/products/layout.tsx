import { type Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Products",
}

export default function ProductLayout({
  products,
  packets,
}: {
  packets: React.ReactNode
  products: React.ReactNode
}) {
  return (
    <Tabs defaultValue="product" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="product">Products</TabsTrigger>
        <TabsTrigger value="packet">Packets</TabsTrigger>
      </TabsList>
      <TabsContent value="product">{products}</TabsContent>
      <TabsContent value="packet">{packets}</TabsContent>
    </Tabs>
  )
}
