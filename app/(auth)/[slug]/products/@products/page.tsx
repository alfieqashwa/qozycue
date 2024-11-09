import { Suspense } from "react"
import { SkeletonDashboardCard } from "@/app/_components/skeleton-dashboard-card"
import { api } from "@/trpc/server"
import { columnsProduct } from "./columns-product"
import { ProductTable } from "./product-table"

export default async function Page() {
  const products = await api.product.findAllByCompanyId()
  return (
    <Suspense fallback={<SkeletonDashboardCard className="h-[700px]" />}>
      <ProductTable data={products} columns={columnsProduct} />
    </Suspense>
  )
}
