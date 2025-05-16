import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Products",
}

export default async function ProductLayout({
  products,
  packets,
}: {
  packets: React.ReactNode
  products: React.ReactNode
}) {
  const token = await convexAuthNextjsToken()
  const session = await fetchQuery(api.sessions.find, {}, { token })
  if (!session) redirect("/signin")
  if (session.user.role === "CASHIER")
    redirect(
      `/${encodeURIComponent(session.user.company?.slug as string)}/tables/`,
    )
  return (
    <Tabs defaultValue="product">
      <TabsList className="mb-2">
        <TabsTrigger value="product">Products</TabsTrigger>
        <TabsTrigger value="packet">Packets</TabsTrigger>
      </TabsList>
      <TabsContent value="product">{products}</TabsContent>
      <TabsContent value="packet">{packets}</TabsContent>
    </Tabs>
  )
}
