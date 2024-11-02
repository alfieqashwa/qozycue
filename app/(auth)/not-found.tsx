"use client"

import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { FaceFrownIcon } from "@heroicons/react/24/outline"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NotFound() {
  const { data: slug, status } = useTanstackQuery(
    convexQuery(api.companies.slug, {}),
  )

  const pathname = usePathname()
  const href = !!slug
    ? status === "success" && pathname.includes("dewa")
      ? "/dewa"
      : `/${encodeURIComponent(slug)}/dashboard`
    : "/portal"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-primary" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find requested.</p>
      <Link
        href={href}
        className="mt-4 rounded-md bg-primary/75 px-4 py-2 text-sm text-white transition-colors hover:bg-primary"
      >
        Go Back
      </Link>
    </main>
  )
}
