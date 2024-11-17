"use client"

import { SignOutButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { useQuery } from "convex/react"

export default function DashboardPage() {
  const me = useQuery(api.users.me, {})
  const session = useQuery(api.sessions.find, {})

  return (
    <div>
      <h2>Dashboard Page</h2>
      <SignOutButton />
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <pre>{JSON.stringify(me, null, 2)}</pre>
      <ListOfTables companyId={session?.companyId!} />
    </div>
  )
}

const ListOfTables = ({ companyId }: { companyId: Id<"companies"> }) => {
  const { data, status } = useTanstackQuery(
    convexQuery(api.pooltables.findAll, { companyId }),
  )
  return (
    <div className="mt-12 text-center text-2xl">
      <h2>List of Pool Table</h2>
      <ul>
        {status === "success" &&
          data.map((t) => (
            <li key={t._id}>
              <p>Name: {t.name}</p>
              <p>Description: {t.description}</p>
              <p>IsActive: {t.isActive.toString()}</p>
              <p>Gap: {t.gapDuration}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}
