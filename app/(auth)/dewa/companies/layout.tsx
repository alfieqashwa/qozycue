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
    <Tabs defaultValue="company" className="mt-2">
      <TabsList className="mb-3">
        <TabsTrigger value="company">Companies</TabsTrigger>
        <TabsTrigger value="user">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="company">{companyTab}</TabsContent>
      <TabsContent value="user">{userTab}</TabsContent>
    </Tabs>
  )
}
