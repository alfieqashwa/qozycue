"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsCompany } from "./columns-company"
import { CompanyTable } from "./company-table"

export default function Page() {
  const companies = useTanstackQuery(convexQuery(api.companies.findAll, {}))

  if (companies.status !== "success") return <LoadingSpinner />
  return <CompanyTable data={companies.data} columns={columnsCompany} />
}
