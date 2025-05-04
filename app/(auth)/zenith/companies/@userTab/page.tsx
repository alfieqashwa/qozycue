"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { columnsUser } from "./columns-user"
import { UserTable } from "./user-table"

export default function Page() {
  const users = useTanstackQuery({
    ...convexQuery(api.users.findAll, {}),
    select: (data) =>
      data.toSorted((p, q) => q._creationTime - p._creationTime),
  })

  if (users.status !== "success") return <LoadingSpinner />
  return <UserTable data={users.data} columns={columnsUser} />
}
