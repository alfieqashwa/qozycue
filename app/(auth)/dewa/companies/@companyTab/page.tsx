import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { columnsCompany } from "./columns-company"
import { CompanyTable } from "./company-table"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"

export default async function Page() {
  // const companies = await api.company.findAllDewa()
  const companies = await fetchQuery(
    api.companies.findAll,
    {},
    { token: convexAuthNextjsToken() },
  )
  if (!companies) return []
  return <CompanyTable data={companies} columns={columnsCompany} />
}
