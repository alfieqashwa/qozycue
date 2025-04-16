import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function TransactionLayout({
  orders,
  rentals,
  orderlines,
}: Readonly<{
  orders: React.ReactNode
  rentals: React.ReactNode
  orderlines: React.ReactNode
}>) {
  return (
    <Tabs defaultValue="order" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="order">Orders</TabsTrigger>
        <TabsTrigger value="pool-rental">Pool Rentals</TabsTrigger>
        <TabsTrigger value="orderline">Orderlines</TabsTrigger>
      </TabsList>
      <TabsContent value="order">{orders}</TabsContent>
      <TabsContent value="pool-rental">{rentals}</TabsContent>
      <TabsContent value="orderline">{orderlines}</TabsContent>
    </Tabs>
  )
}
