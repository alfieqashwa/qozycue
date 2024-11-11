import { type Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function TransactionLayout({
  orders,
  // rentals,
  // orderlines,
}: Readonly<{
  orders: React.ReactNode
  // rentals: React.ReactNode
  // orderlines: React.ReactNode
}>) {
  // ? not allowing owner to click button ???

  // const managerAndCashierAccessLevel =
  //   session?.user.role === "DEWA" ||
  //   session?.user.role === "ADMIN" ||
  //   session?.user.role === "MANAGER" ||
  //   session?.user.role === "CASHIER"

  return (
    <Tabs defaultValue="order" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="order">Orders</TabsTrigger>
        {/* <TabsTrigger value="pool-rental">Pool Rentals</TabsTrigger>
        <TabsTrigger value="orderline">Orderlines</TabsTrigger> */}
      </TabsList>
      <TabsContent value="order">
        {/* <OrderTab disabledBasedOnAccessLevel={!managerAndCashierAccessLevel} /> */}
        {orders}
      </TabsContent>
      {/* <TabsContent value="pool-rental">{rentals}</TabsContent>
      <TabsContent value="orderline">{orderlines}</TabsContent> */}
    </Tabs>
  )
}
