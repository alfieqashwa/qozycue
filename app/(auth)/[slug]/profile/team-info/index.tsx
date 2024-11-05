"use client"

import { LoadingSpinner } from "@/app/_components/loading"
import { api } from "@/trpc/react"
import { columnsTeam } from "./columns-team"
import { TeamTable } from "./team-table"

export function TeamInfo({ companyId }: { companyId: string }) {
  const users = api.user.findAllByCompanyId.useQuery({ companyId })

  if (users.status !== "success") return <LoadingSpinner />

  return <TeamTable data={users.data} columns={columnsTeam} />
}
