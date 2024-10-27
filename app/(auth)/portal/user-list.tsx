"use client"

import { LoaderButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"

export default function UserList() {
  const { data, isPending } = useQuery(convexQuery(api.users.findAll, {}))

  return (
    <div className="mt-8">
      <h2>List of Users</h2>
      <ul className="mt-4">
        {isPending ? (
          <LoaderButton />
        ) : (
          data?.map((user) => (
            <li key={user._id}>
              <p>name: {user.name}</p>
              <p>email: {user.email}</p>
              <p>role: {user.role}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
