"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsProduct } from "./columns-product"
import { ProductTable } from "./product-table"

export default function Page() {
  const { data: products, status } = useTanstackQuery(
    convexQuery(api.products.findAll, {}),
  )

  if (status !== "success")
    return <SkeletonDashboardCard className="h-[700px]" />
  return <ProductTable data={products} columns={columnsProduct} />
}
