import { HoverBorderGradient } from "@/components/hover-border-gradient"
import { ShimmerButton } from "@/components/shimmer-button"
import { Vortex } from "@/components/vortex"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Tv, Utensils } from "lucide-react"
import { GiPoolTriangle } from "react-icons/gi"
import { AuthButtons } from "./auth-buttons"
import { DocumentationButton } from "./documentation-button"
import { Hero } from "./hero"

export default async function HomePage() {
  const slug = await fetchQuery(
    api.companies.slug,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return (
    <Vortex rangeY={400} className="z-50">
      <section className="flex justify-center text-center">
        <HoverBorderGradient>
          <span className="animate-pulse px-0 text-xs font-semibold text-fuchsia-500 uppercase lg:px-2 lg:text-sm">
            free if you only have 10 pool tables
          </span>
        </HoverBorderGradient>
      </section>
      <Hero />
      <section className="flex w-full items-center justify-between px-6 py-6 sm:hidden">
        <GiPoolTriangle className="animate-pulse-slow size-14 text-fuchsia-600 sm:size-16 lg:size-24" />
        <Utensils className="animate-pulse-slow size-12 text-fuchsia-600 sm:size-14 lg:size-[5rem]" />
      </section>
      <section className="flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row md:gap-8 lg:gap-16">
        <DocumentationButton
          icon={
            <GiPoolTriangle
              size={24}
              className="animate-pulse text-fuchsia-500"
            />
          }
          title="Documentation"
        />
        <ShimmerButton>
          <a
            // href="https://www.youtube.com/playlist?list=PLnWWQuvB-wxg2PHPh4aybEZaqREqcrVuN"
            href="https://docs.qozycue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center text-center"
          >
            <Tv className="mr-1.5 animate-pulse text-fuchsia-500" />
            Tutorial (WIP)
          </a>
        </ShimmerButton>
      </section>
      <section className="flex items-center justify-center gap-4">
        <AuthButtons slug={slug} />
      </section>
    </Vortex>
  )
}
