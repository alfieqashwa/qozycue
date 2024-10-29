import { SignOutButton } from "@/components/sign-button"
import { unstable_noStore as noStore } from "next/cache"

export default function DashboardPage() {
  noStore()
  return (
    <div>
      <h2>Dashboard Page</h2>
      <SignOutButton />
    </div>
  )
}
