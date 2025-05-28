import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vortex } from "@/components/vortex"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
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
      {/* <section className="flex justify-center text-center"> */}
      {/*   <HomeMenu /> */}
      {/* </section> */}
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="fixed top-0 left-1/2 z-10 w-[400px] -translate-x-1/2 lg:top-10">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        <HomeContent slug={slug} />
        <TabsContent value="features">
          <Pricing />
        </TabsContent>
        <TabsContent value="pricing">
          <Pricing />
        </TabsContent>
      </Tabs>
    </Vortex>
  )
}
