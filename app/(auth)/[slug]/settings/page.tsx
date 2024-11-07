import { LoadingSpinner } from "@/components/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { DiscountTab } from "./discount-tab"
import { CreateDiscount } from "./discount-tab/create-discount"
import { TaxTab } from "./tax-tab"
import { CreateTax } from "./tax-tab/create-tax"
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

  if (session.user.role === "CASHIER")
    redirect(`/${encodeURIComponent(session.companySlug!)}/tables`)

  const isSuperAdmin = session.user.role === "DEWA"
  const isAdmin = session.user.role === "ADMIN"

  return (
    <Tabs
      defaultValue={isSuperAdmin ? "category" : isAdmin ? "pool" : "tax"}
      className="mt-2"
    >
      <TabsList className="mb-3">
        {isSuperAdmin && (
          <>
            <TabsTrigger
              value="category"
              className="data-[state=active]:text-rose-500"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="uom"
              className="data-[state=active]:text-rose-500"
            >
              UoM
            </TabsTrigger>
          </>
        )}
        {(isSuperAdmin || isAdmin) && (
          <TabsTrigger value="pool">Pool Tables</TabsTrigger>
        )}
        <TabsTrigger className="hidden sm:block" value="tax">
          Taxes
        </TabsTrigger>
        <TabsTrigger className="hidden sm:block" value="discount">
          Discounts
        </TabsTrigger>
      </TabsList>
      {isSuperAdmin && (
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
      {(isSuperAdmin || isAdmin) && (
        <TabsContent value="pool">
          <h2>Pool Table Tab</h2>
          {/* // TODO: */}
          {/* <PoolTableTab /> */}
        </TabsContent>
      )}
      {/* // TODO: Migrate Tax Tab */}
      <TabsContent value="tax">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="text-right">
            <CreateTax companyId={session.companyId!} />
          </div>
          <TaxTab companyId={session.companyId!} />
        </Suspense>
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
