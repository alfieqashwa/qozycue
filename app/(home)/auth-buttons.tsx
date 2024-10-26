"use client"

import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export const AuthButtons = ({
  isUser,
  slug,
}: {
  isUser: boolean
  slug: string | undefined
}) => {
  const { signIn, signOut } = useAuthActions()
  return (
    <div className="my-16 flex justify-center gap-4">
      <AuthLoading>
        <Button size="lg">
          <Loader2 size={20} className="mr-2 animate-spin" /> Loading
        </Button>
      </AuthLoading>
      <Unauthenticated>
        <Button
          size="lg"
          onClick={() => void signIn("google", { redirectTo: "/portal" })}
        >
          Sign In
        </Button>
      </Unauthenticated>
      <Authenticated>
        {/** Show Button if the user is signed-in. The link and the button's title depends on whether the signed-in user has already created the company or not (yet) */}
        {isUser && (
          <Button asChild size="lg">
            <Link
              href={
                !!slug ? `/${encodeURIComponent(slug)}/dashboard` : "/portal"
              }
            >
              {!!slug ? "Dashboard" : "Create Company"}
            </Link>
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={() => void signOut()}>
          Sign Out
        </Button>
      </Authenticated>
    </div>
  )
}
