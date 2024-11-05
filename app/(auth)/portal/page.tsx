import { CONTACT } from "@/app/constants/contact"
import { SignOutButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { FaceSmileIcon } from "@heroicons/react/24/solid"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import { TriggerTrialButton } from "./trigger-trial-button"

export const metadata: Metadata = {
  title: "Portal",
}

export default async function Page() {
  const session = await fetchQuery(
    api.sessions.find,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!!session._id && session.user.role !== "USER") {
    if (session.user.role === "DEWA") redirect("/dewa/")
    if (session.user.role === "ADMIN" || session.user.role === "OWNER")
      redirect(`/${encodeURIComponent(session.companySlug!)}/dashboard/`)
    if (session.user.role === "MANAGER")
      redirect(`/${encodeURIComponent(session.companySlug!)}/transactions/`)
    if (session.user.role === "CASHIER")
      redirect(`/${encodeURIComponent(session.companySlug!)}/tables/`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-2 font-semibold">
      <FaceSmileIcon className="w-10 text-primary" />
      <h2 className="text-xl font-semibold">Welcome to Qozy Cue App.</h2>
      <p className="max-w-4xl pt-4 text-center">
        Tekan
        <TriggerTrialButton userRole={session.user.role === "USER"} />
        untuk mencoba aplikasi kami
        <span className="pl-1 text-primary">secara gratis</span>. Tekan ikon
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
    </main>
  )
}
