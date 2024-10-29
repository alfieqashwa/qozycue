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
import UserList from "./user-list"

export const metadata: Metadata = {
  title: "Portal",
}

export default async function Page() {
  const viewer = await fetchQuery(
    api.users.me,
    {},
    { token: convexAuthNextjsToken() },
  )

  if (!viewer) redirect("/")

  const company = await fetchQuery(api.companies.findCompanyByUserId, {
    userId: viewer._id,
  })

  // if user already has company, then it redirect to [slug] pages
  if (!!viewer && !!company) {
    const slug = company.find((c) => c.userId === viewer._id)?.slug!

    if (viewer.role === "DEWA") redirect("/dewa/")
    if (viewer.role === "ADMIN" || viewer.role === "OWNER")
      redirect(`/${encodeURIComponent(slug)}/dashboard/`)
    if (viewer.role === "MANAGER")
      redirect(`/${encodeURIComponent(slug)}/transactions/`)
    if (viewer.role === "CASHIER")
      redirect(`${encodeURIComponent(slug)}/tables/`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-2 font-semibold">
      <FaceSmileIcon className="w-10 text-primary" />
      <h2 className="text-xl font-semibold">Welcome to Qozy Cue App.</h2>
      <p className="max-w-4xl pt-4 text-center">
        Tekan
        <TriggerTrialButton userRole={viewer?.role === "USER"} />
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
      <UserList />
    </main>
  )
}
