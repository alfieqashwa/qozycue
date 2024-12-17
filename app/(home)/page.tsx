import { ShimmerButton } from "@/components/shimmer-button"
import { Vortex } from "@/components/vortex"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { Tv } from "lucide-react"
import { GiPoolTriangle } from "react-icons/gi"
import { AuthButtons } from "./auth-buttons"
import { DocumentationButton } from "./documentation-button"
import { Hero } from "./hero"
import { ResetAll } from "@/components/reset-all"

export default async function HomePage() {
  const preloadSlug = await preloadQuery(
    api.companies.slug,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return (
    <Vortex rangeY={400} className="z-50">
      <Hero />
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-8 lg:gap-16">
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
          <Tv className="mr-1.5 animate-pulse text-fuchsia-500" />
          Tutorial (soon)
        </ShimmerButton>
      </div>
      <section className="mt-20 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-4">
          <AuthButtons preloadSlug={preloadSlug} />
        </div>
        <ResetAll />
      </section>
    </Vortex>
  )
}
