import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tables",
}

export default function TableLayout({
  poolTables,
  cafeOnly,
}: Readonly<{ poolTables: React.ReactNode; cafeOnly: React.ReactNode }>) {
  return (
    <Tabs defaultValue="pool" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="pool">Pools</TabsTrigger>
        <TabsTrigger value="cafe-only" className="relative">
          Cafe Only
          {/* <OpenStatusCounter /> */}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pool">
        {/* <PoolTableTab
          managerAccessLevel={managerAccessLevel}
          cashierAccessLevel={cashierAccessLevel}
        /> */}
        {poolTables}
      </TabsContent>
      <TabsContent value="cafe-only" className="relative">
        {/* <CafeOnlyTab
          managerAccessLevel={managerAccessLevel}
          cashierAccessLevel={cashierAccessLevel}
        /> */}
        {cafeOnly}
      </TabsContent>
    </Tabs>
  )
}
