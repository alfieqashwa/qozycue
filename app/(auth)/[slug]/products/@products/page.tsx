"use client"

import { SkeletonDashboardCard } from "@/components/skeleton-dashboard-card"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { type ICountry } from "@/types"
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

  const { locale, currency } = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  ) as ICountry

  if (status !== "success")
    return <SkeletonDashboardCard className="h-[700px]" />
  return (
    <ProductTable
      data={products}
      columns={columnsProduct(
        company.data?.isStockable as boolean,
        locale,
        currency,
      )}
    />
  )
}
