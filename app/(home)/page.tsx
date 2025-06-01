import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vortex } from "@/components/vortex"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { Features } from "./features"
import { HomeContent } from "./home-menu"
import { Pricing } from "./pricing"

export default async function HomePage() {
  const slug = await fetchQuery(
    api.companies.slug,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return (
    <Vortex rangeY={400} className="z-50">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="animate-shimmer text-foreground fixed top-0 left-1/2 z-10 inline-flex h-11 w-[400px] -translate-x-1/2 items-center justify-center rounded-full border-2 border-zinc-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors focus:ring-1 focus:ring-zinc-400 focus:ring-offset-1 focus:ring-offset-zinc-50 focus:outline-hidden lg:top-10">
          <TabsTrigger
            value="home"
            className="rounded-l-full rounded-r-md font-semibold"
          >
            Home
          </TabsTrigger>
          <TabsTrigger value="features" className="font-semibold">
            Features
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-l-md rounded-r-full font-semibold"
          >
            Pricing
          </TabsTrigger>
        </TabsList>
        <HomeContent slug={slug} />
        <TabsContent value="features">
          <Features />
        </TabsContent>
        <TabsContent value="pricing">
          <Pricing />
        </TabsContent>
      </Tabs>
    </Vortex>
  )
}
