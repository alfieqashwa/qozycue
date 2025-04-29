import { LoadingSpinner } from "@/components/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { CategoryTab } from "./category-tab"
import { CreateCategory } from "./category-tab/create-category"
import { DiscountTab } from "./discount-tab"
import { CreateDiscount } from "./discount-tab/create-discount"
import { PoolTableTab } from "./pool-table-tab"
import { CreatePoolTable } from "./pool-table-tab/create-pool-table"
import { TaxTab } from "./tax-tab"
import { CreateTax } from "./tax-tab/create-tax"
import { UoMTab } from "./uom-tab"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingPage() {
  const token = await convexAuthNextjsToken()
  const session = await fetchQuery(api.sessions.find, {}, { token })

  if (!session) redirect("/signin")

  const companyId = session.user.companyId as Id<"companies">
  const isSuperAdmin = session.user.role === "ZENITH"
  const isAdmin = session.user.role === "ADMIN"

  if (session.user.role === "CASHIER")
    redirect(
      `/${encodeURIComponent(session.user.company?.slug as string)}/tables`,
    )

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
          <TabsTrigger
            value="pool"
            className="data-[state=active]:text-amber-400"
          >
            Pool Tables
          </TabsTrigger>
        )}
        <TabsTrigger className="hidden sm:block" value="tax">
          Taxes
        </TabsTrigger>
        <TabsTrigger className="hidden sm:block" value="discount">
          Discounts
        </TabsTrigger>
      </TabsList>
      {isSuperAdmin && (
        <Suspense fallback={<LoadingSpinner />}>
          <TabsContent
            value="category"
            className="flex flex-col space-y-1 md:items-end"
          >
            <CreateCategory />
            <CategoryTab />
          </TabsContent>
          <TabsContent value="uom">
            <UoMTab />
          </TabsContent>
        </Suspense>
      )}
      {(isSuperAdmin || isAdmin) && (
        <TabsContent value="pool">
          <div className="text-right">
            <CreatePoolTable companyId={companyId} />
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <PoolTableTab companyId={companyId} />
          </Suspense>
        </TabsContent>
      )}
      {/* // TODO: Migrate Tax Tab */}
      <TabsContent value="tax">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="text-right">
            <CreateTax companyId={companyId} />
          </div>
          <TaxTab />
        </Suspense>
      </TabsContent>
      {/* // TODO: Check what's the different with the other tabs */}
      <Suspense fallback={<LoadingSpinner />}>
        <TabsContent value="discount">
          <div className="text-right">
            <CreateDiscount companyId={companyId} />
          </div>
          <DiscountTab companyId={companyId} />
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
