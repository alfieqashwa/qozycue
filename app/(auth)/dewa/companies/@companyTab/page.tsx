import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { columnsCompany } from "./columns-company"
import { CompanyTable } from "./company-table"

export default async function Page() {
  // const companies = await api.company.findAllDewa()
  const companies = await fetchQuery(api.companies.findAll)
  if (!companies) return []
  return <CompanyTable data={companies} columns={columnsCompany} />
}
