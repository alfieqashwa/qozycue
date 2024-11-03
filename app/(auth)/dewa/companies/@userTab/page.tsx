"use client"

import { useQuery } from "@tanstack/react-query"
import { columnsUser } from "./columns-user"
import { UserTable } from "./user-table"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"

export default function Page() {
  const users = useQuery(convexQuery(api.users.findAll, {}))

  if (users.status !== "success") return <p>Loading...</p>
  return <UserTable data={users.data} columns={columnsUser} />
}
