import { FaceFrownIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default async function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-primary" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find requested.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary/75 px-4 py-2 text-sm text-white transition-colors hover:bg-primary"
      >
        Go To Home Page
      </Link>
    </main>
  )
}
