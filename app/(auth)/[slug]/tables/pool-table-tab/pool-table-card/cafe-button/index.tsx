import { useMediaQuery } from "@/app/hooks/use-media-query"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { Coffee, ShoppingBasket, Soup, UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import { OrderList } from "./order-list"
import { ProductMenuCard } from "./product-menu-card"
import { SearchProductInput } from "./search-product-input"

type CafeButtonProps = {
  isManager: boolean
  isCashier: boolean
  order?:
    | FunctionReturnType<typeof api.orders.findByPoolTableId>
    | FunctionReturnType<typeof api.orders.findAllPendingStatusByPoolTableId>[0]
    | FunctionReturnType<typeof api.orders.findAllCafeOnlyByCompanyId>[0]
  poolTableName?: string
}
export function CafeButton({
  isManager,
  isCashier,
  order,
  poolTableName,
}: CafeButtonProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: company } = useTanstackQuery({
    ...convexQuery(api.companies.find, { id: order?.companyId }),
    enabled: Boolean(order?.companyId),
  })
  const { data: orderlines } = useTanstackQuery({
    ...convexQuery(api.orderlines.findAllByOrderId, { orderId: order?._id }),
    enabled: Boolean(order?._id),
  })

  const { data: products, status } = useTanstackQuery({
    ...convexQuery(api.products.findAll, {}),
    select: (products) => {
      const filteredProducts = (category: string) =>
        products.filter(
          (p) =>
            p.status === "enabled" &&
            p.category?.name === category &&
            p.name.includes(searchTerm),
        )
      return {
        foods: filteredProducts("food"),
        drinks: filteredProducts("drink"),
        others: filteredProducts("others"),
      }
    },
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          disabled={!order?._id}
          variant="secondary"
          className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <UtensilsCrossed
            size={20}
            className={cn(!!orderlines?.length && "text-emerald-400")}
          />
          <span>Cafe</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="h-[calc(100vh_-_5rem)] min-w-full"
        onCloseAutoFocus={() => setSearchTerm("")}
      >
        {/* Title is a must!! Source -> https://github.com/shadcn-ui/ui/issues/4302 */}
        <DrawerTitle className="hidden"></DrawerTitle>
        <DrawerDescription className="hidden"></DrawerDescription>
        <ScrollArea className="w-full p-2">
          <Tabs defaultValue="food" className="mt-2">
            <div className="flex space-x-4 px-4">
              <SearchProductInput
                placeholder="Search..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <TabsList className="mb-4 md:mb-8">
                {["food", "drink", "others"].map((categoryName, i) => (
                  <TabsTrigger
                    value={categoryName}
                    className="capitalize"
                    key={i}
                    onClick={() => setSearchTerm("")}
                  >
                    {categoryName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex space-x-4 xl:space-x-6 xl:px-4">
              {status !== "success" && <LoadingSpinner />}
              <TabsContent value="food" className="xl:w-8/12">
                <WrapperProductMenuCard>
                  {status === "success" &&
                    products.foods.map((p) => (
                      <ProductMenuCard
                        isCashier={isCashier}
                        isDesktop={isDesktop}
                        orderlines={orderlines}
                        orderId={order?._id!}
                        productId={p._id}
                        name={p.name}
                        price={p.salePrice}
                        isStockable={company?.isStockable as boolean}
                        countInStock={p.countInStock}
                        bgColor="bg-emerald-200/70"
                        stockTextColor="text-emerald-900"
                        key={p._id}
                      >
                        <Soup strokeWidth={2.5} className="text-emerald-900" />
                      </ProductMenuCard>
                    ))}
                </WrapperProductMenuCard>
              </TabsContent>
              <TabsContent value="drink" className="xl:w-8/12">
                <WrapperProductMenuCard>
                  {status === "success" &&
                    products.drinks.map((p) => (
                      <ProductMenuCard
                        isCashier={isCashier}
                        isDesktop={isDesktop}
                        orderlines={orderlines}
                        orderId={order?._id!}
                        productId={p._id}
                        name={p.name}
                        price={p.salePrice}
                        isStockable={company?.isStockable as boolean}
                        countInStock={p.countInStock}
                        bgColor="bg-fuchsia-200/70"
                        stockTextColor="text-fuchsia-900"
                        key={p._id}
                      >
                        <Coffee
                          strokeWidth={2.5}
                          className="text-fuchsia-900"
                        />
                      </ProductMenuCard>
                    ))}
                </WrapperProductMenuCard>
              </TabsContent>
              <TabsContent value="others" className="xl:w-8/12">
                <WrapperProductMenuCard>
                  {status === "success" &&
                    products.others.map((p) => (
                      <ProductMenuCard
                        isCashier={isCashier}
                        isDesktop={isDesktop}
                        orderlines={orderlines}
                        orderId={order?._id!}
                        productId={p._id}
                        name={p.name}
                        price={p.salePrice}
                        isStockable={company?.isStockable as boolean}
                        countInStock={p.countInStock}
                        bgColor="bg-lime-200/70"
                        stockTextColor="text-lime-900"
                        key={p._id}
                      >
                        <ShoppingBasket
                          strokeWidth={2.5}
                          className="text-lime-900"
                        />
                      </ProductMenuCard>
                    ))}
                </WrapperProductMenuCard>
              </TabsContent>
              {!!orderlines?.length && (
                <OrderList
                  isManager={isManager}
                  isCashier={isCashier}
                  poolTableName={poolTableName}
                  customerName={order?.customer?.name}
                  orderlines={orderlines}
                />
              )}
            </div>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

const WrapperProductMenuCard = (props: {
  className?: string
  children: React.ReactNode
}) => (
  <ScrollArea className={cn("h-svh", props.className)}>
    <ul className="flex flex-wrap justify-center gap-6 px-4">
      {props.children}
    </ul>
  </ScrollArea>
)
