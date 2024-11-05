"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { columnsTeam } from "./columns-team"
import { TeamTable } from "./team-table"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export function TeamInfo({ companyId }: { companyId: Id<"companies"> }) {
  const users = useTanstackQuery({
    enabled: Boolean(companyId),
    ...convexQuery(api.users.findAllByCompanyId, { companyId }),
  })

  if (users.status !== "success") return <LoadingSpinner />

  return (
    <div>
      <pre>{JSON.stringify(users.data, null, 2)}</pre>
    </div>
  )
  // return <TeamTable data={users.data} columns={columnsTeam} />
}
