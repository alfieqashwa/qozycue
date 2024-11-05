import { type Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { getServerAuthSession } from "~/server/auth"
import { ContactDeveloperWhatsapp } from "./contact-developer-whatsapp"
import { TeamInfo } from "./team-info"
import { UserInfo } from "./user-info"

export const metadata: Metadata = {
  title: "Profile",
}

export default async function Page() {
  noStore()
  const session = await getServerAuthSession()
  const adminAccessLevel =
    session?.user.role === "ADMIN" || session?.user.role === "DEWA"

  return (
    <div className="relative">
      <Tabs defaultValue="profile" className="mt-2">
        <TabsList className="mb-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {adminAccessLevel && <TabsTrigger value="team">Team</TabsTrigger>}
        </TabsList>
        <TabsContent value="profile">
          <UserInfo isAdmin={adminAccessLevel} />
        </TabsContent>
        {adminAccessLevel && (
          <TabsContent value="team">
            <TeamInfo companyId={session.user.companyId as string} />
          </TabsContent>
        )}
      </Tabs>
      {session?.user.role !== "DEWA" && <ContactDeveloperWhatsapp />}
    </div>
  )
}
