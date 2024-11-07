import { type Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryTab } from "./category-tab"
import { PoolTableTab } from "./pool-table-tab"
import { UoMTab } from "./uom-tab"
import { TaxTab } from "./tax-tab"
import { DiscountTab } from "./discount-tab"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingPage() {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  const superAdminAccessLevel = session.user.role === "DEWA"
  const adminAccessLevel = session.user.role === "ADMIN"
  return (
    <Tabs
      defaultValue={
        session.user.role === "DEWA" || session.user.role === "ADMIN"
          ? "pool"
          : "taxes"
      }
      className="mt-2"
    >
      <TabsList className="mb-3">
        {superAdminAccessLevel && (
          <TabsTrigger value="category">Categories</TabsTrigger>
        )}
        {adminAccessLevel && (
          <TabsTrigger value="pool">Pool Tables</TabsTrigger>
        )}
        <TabsTrigger className="hidden sm:block" value="tax">
          Taxes
        </TabsTrigger>
        <TabsTrigger className="hidden sm:block" value="discount">
          Discounts
        </TabsTrigger>
        <TabsTrigger value="uom">UoM</TabsTrigger>
      </TabsList>
      {superAdminAccessLevel && (
        <TabsContent value="category">
          <CategoryTab />
        </TabsContent>
      )}
      {adminAccessLevel && (
        <TabsContent value="pool">
          <PoolTableTab />
        </TabsContent>
      )}
      <TabsContent value="tax">
        <TaxTab />
      </TabsContent>
      <TabsContent value="discount">
        <DiscountTab />
      </TabsContent>
      <TabsContent value="uom">
        <UoMTab />
      </TabsContent>
    </Tabs>
  )
}

/**
 ** NOTES:
 ** Categories: SuperAdminProcedure
 ** PoolTables: AdminProcedure
 ** Taxes, Discounts, UoM: ManagerProcedure
 ** Owner can go to Settings Page except Categories Tab but no access
 ** Cashier cannot find nor access to Settings Page
 */
