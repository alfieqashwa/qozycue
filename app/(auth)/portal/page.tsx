import { CONTACT } from "@/app/constants/contact"
import { SignOutButton } from "@/components/sign-button"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import { CreateTrialCompanyForm } from "./create-trial-company-form"

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
    <main className="relative flex min-h-screen items-center justify-center bg-black p-4">
      <div className="fixed top-1 right-2 md:top-4 md:right-4">
        <SignOutButton />
      </div>
      <CreateTrialCompanyForm />
      <div className="fixed right-2 bottom-1 md:right-4 md:bottom-4">
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse-slow inline-block"
        >
          <Image
            src="/images/icon-whatsapp.svg"
            alt="whatsapp-logo"
            width={40}
            height={40}
            className="size-10 md:size-12"
          />
        </a>
      </div>
    </main>
  )
}
