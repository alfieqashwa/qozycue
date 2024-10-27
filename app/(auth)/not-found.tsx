import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { FaceFrownIcon } from "@heroicons/react/24/outline"
import { fetchQuery } from "convex/nextjs"
import { headers } from "next/headers"
import Link from "next/link"

export default async function NotFound() {
  const slug = await fetchQuery(
    api.companies.slug,
    {},
    { token: convexAuthNextjsToken() },
  )

  const headersList = headers()
  // read the custom x-url header
  const fullUrl = headersList.get("referer") ?? ""
  const href = !!slug
    ? fullUrl.includes("dewa")
      ? "/dewa"
      : `/${encodeURIComponent(slug)}/dashboard`
    : "/portal" // href will be "/portal" for "USER" role.

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
