"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsProduct } from "./columns-product"
import { ProductTable } from "./product-table"

export default function Page() {
  const { data: products, status } = useTanstackQuery(
    convexQuery(api.products.findAll, {}),
  )

  const company = useTanstackQuery({
    ...convexQuery(api.companies.find, { id: products?.[0]?.companyId }),
    enabled: !!products?.[0]?.companyId,
  })

  const country = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  )

  if (
    status !== "success" ||
    company.status !== "success" ||
    !country // ensure country is defined
  ) {
    return <SkeletonDashboardCard className="h-[700px]" />
  }

  const { locale, currency } = country
  return (
    <ProductTable
      data={products}
      columns={columnsProduct(
        company.data?.isStockable ?? false, // fallback if needed
        locale,
        currency,
      )}
    />
  )
}
