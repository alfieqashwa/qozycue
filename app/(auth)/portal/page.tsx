import { CONTACT } from "@/app/constants/contact"
import { SignOutButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { FaceSmileIcon } from "@heroicons/react/24/solid"
import { fetchQuery } from "convex/nextjs"
import { Link as LinkIcon } from "lucide-react"
import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { TriggerTrialButton } from "./trigger-trial-button"

export const metadata: Metadata = {
  title: "Portal",
}

export default async function Page() {
  const token = await convexAuthNextjsToken()
  const session = await fetchQuery(api.sessions.find, {}, { token })

  if (!session) redirect("/signin")

  // if user is not a USER & has a company, then redirect to their respective page
  if (session.user.role !== "USER" && !!session.user.company?.slug) {
    if (session.user.role === "ZENITH") redirect("/zenith/")
    if (session.user.role === "ADMIN" || session.user.role === "OWNER")
      redirect(`/${encodeURIComponent(session.user.company.slug)}/dashboard/`)
    if (session.user.role === "MANAGER")
      redirect(
        `/${encodeURIComponent(session.user.company.slug)}/transactions/`,
      )
    if (session.user.role === "CASHIER")
      redirect(`/${encodeURIComponent(session.user.company.slug)}/tables/`)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-2 p-2 font-semibold">
      <FaceSmileIcon className="text-primary w-10" />
      <h2 className="text-xl font-semibold md:text-3xl">
        Welcome to Qozy Cue App.
      </h2>
      <p className="max-w-4xl pt-4 text-center">
        Tekan
        <TriggerTrialButton userRole={session.user.role === "USER"} />
        untuk mencoba aplikasi kami
        <span className="text-primary pl-1">secara gratis</span>. Tekan ikon
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 inline-block"
        >
          <Image
            src="/images/icon-whatsapp.svg"
            alt="whatsapp-logo"
            width={25}
            height={25}
          />
        </a>
        untuk informasi lebih lanjut.
      </p>
      <p>
        Tekan <SignOutButton size="sm" /> untuk keluar.
      </p>
      <p className="text-center">Terimakasih.</p>

      {/* only show for zenith user when it has no company yet */}
      {session.user.role === "ZENITH" && (
        <div className="absolute right-2 bottom-2">
          <Link href="/zenith/">
            <LinkIcon />
          </Link>
        </div>
      )}
    </main>
  )
}
