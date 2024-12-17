import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { type Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { ContactDeveloperWhatsapp } from "./contact-developer-whatsapp"
import { TeamInfo } from "./team-info"
import { UserInfo } from "./user-info"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile",
}

export default async function ProfilePage() {
  noStore()
  const user = await fetchQuery(
    api.users.me,
    {},
    { token: await convexAuthNextjsToken() },
  )

  if (!user) redirect("/signin")

  const adminAccessLevel = user.role === "ADMIN" || user.role === "DEWA"

  return (
    <div className="relative">
      <Tabs defaultValue="profile" className="mt-2">
        <TabsList className="mb-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {adminAccessLevel && <TabsTrigger value="team">Team</TabsTrigger>}
        </TabsList>
        <TabsContent value="profile">
          <UserInfo
            adminAccessLevel={adminAccessLevel}
            userId={user._id}
            companyId={user.companyId}
          />
        </TabsContent>
        {adminAccessLevel && (
          <TabsContent value="team">
            <TeamInfo companyId={user.companyId} />
          </TabsContent>
        )}
      </Tabs>
      {user.role !== "DEWA" && <ContactDeveloperWhatsapp />}
    </div>
  )
}
