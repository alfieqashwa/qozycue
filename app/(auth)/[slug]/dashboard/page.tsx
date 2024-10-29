"use client"

import { SignOutButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

export default function DashboardPage() {
  const me = useQuery(api.users.me, {})
  const session = useQuery(api.sessions.currentSession, {})

  console.log({ me })
  return (
    <div>
      <h2>Dashboard Page</h2>
      <SignOutButton />
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  )
}
