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
    ? status === "success" && pathname.includes("zenith")
      ? "/zenith"
      : `/${encodeURIComponent(slug)}/dashboard`
    : "/portal"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="text-primary w-10" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find requested.</p>
      <Link
        href={href}
        className="bg-primary/75 hover:bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors"
      >
        Go Back
      </Link>
    </main>
  )
}
