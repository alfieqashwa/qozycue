"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsTeam } from "./columns-team"
import { TeamTable } from "./team-table"

export function TeamInfo({
  companyId,
}: {
  companyId: Id<"companies"> | undefined
}) {
  const users = useTanstackQuery({
    enabled: Boolean(companyId),
    ...convexQuery(api.users.findAllByCompanyId, { companyId: companyId! }),
  })

  if (users.status !== "success") return <LoadingSpinner />
  return <TeamTable data={users.data} columns={columnsTeam} />
}
