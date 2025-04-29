"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { columnsTeam } from "./columns-team"
import { TeamTable } from "./team-table"

export function TeamInfo({
  preloadedSession,
}: {
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const session = usePreloadedQuery(preloadedSession)

  const users = useTanstackQuery({
    ...convexQuery(api.users.findAllByCompanyId, {
      companyId: session.user.companyId as Id<"companies">,
    }),
    enabled: Boolean(session.user.companyId),
    select: (users) =>
      users.filter(
        // exclude SUPER_ADMIN from the list so any ADMIN cannot see it.
        (user) => user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN!,
      ),
  })

  if (users.status !== "success") return <LoadingSpinner />
  return <TeamTable data={users.data} columns={columnsTeam} />
}
