import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Companies",
}

export default function CompanyLayout({
  companyTab,
  userTab,
}: {
  companyTab: React.ReactNode
  userTab: React.ReactNode
}) {
  return (
    <Tabs defaultValue="companies" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="companies">Companies</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="companies">{companyTab}</TabsContent>
      <TabsContent value="users">{userTab}</TabsContent>
    </Tabs>
  )
}
