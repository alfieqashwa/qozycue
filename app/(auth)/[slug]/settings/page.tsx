import { LoadingSpinner } from "@/components/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { Suspense } from "react"
import { DiscountTab } from "./discount-tab"
import { CreateDiscount } from "./discount-tab/create-discount"
import { UoMTab } from "./uom-tab"

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
  const managerAccessLevel = session.user.role === "MANAGER"

  return (
    <Tabs
      defaultValue={
        superAdminAccessLevel ? "category" : adminAccessLevel ? "pool" : "tax"
      }
      className="mt-2"
    >
      <TabsList className="mb-3">
        {superAdminAccessLevel && (
          <>
            <TabsTrigger value="category">Categories</TabsTrigger>
            <TabsTrigger value="uom">UoM</TabsTrigger>
          </>
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
      </TabsList>
      {superAdminAccessLevel && (
        <>
          <TabsContent value="category">
            <h2>Category Tab</h2>
            {/* // TODO: */}
            {/* <CategoryTab /> */}
          </TabsContent>
          <TabsContent value="uom">
            <UoMTab companyId={session.companyId!} />
          </TabsContent>
        </>
      )}
      {adminAccessLevel && (
        <TabsContent value="pool">
          <h2>Pool Table Tab</h2>
          {/* // TODO: */}
          {/* <PoolTableTab /> */}
        </TabsContent>
      )}
      {/* // TODO: Migrate Tax Tab */}
      <TabsContent value="tax">
        <h2>Tax Tab</h2>
        {/* <TaxTab /> */}
      </TabsContent>
      {/* // TODO: Check what's the different with the other tabs */}
      <Suspense fallback={<LoadingSpinner />}>
        <TabsContent value="discount">
          <div className="text-right">
            <CreateDiscount companyId={session.companyId!} />
          </div>
          <DiscountTab companyId={session.companyId!} />
        </TabsContent>
      </Suspense>
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
