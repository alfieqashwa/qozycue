import { type Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderTab } from "./order-tab"
import { OrderlineTab } from "./orderline-tab"
import { RentalTab } from "./rental-tab"

export const metadata: Metadata = {
  title: "Transactions",
}

export default async function TransactionPage() {
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
        <TabsTrigger value="pool-rental">Pool Rentals</TabsTrigger>
        <TabsTrigger value="orderline">Orderlines</TabsTrigger>
      </TabsList>
      <TabsContent value="order">
        <OrderTab disabledBasedOnAccessLevel={!managerAndCashierAccessLevel} />
      </TabsContent>
      <TabsContent value="pool-rental">
        <RentalTab />
      </TabsContent>
      <TabsContent value="orderline">
        <OrderlineTab />
      </TabsContent>
    </Tabs>
  )
}
