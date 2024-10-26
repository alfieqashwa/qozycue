"use client"

import { SignInButton, SignOutButton } from "@/components/sign-button"
import { Button } from "@/components/ui/button"
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
  return (
    <div className="my-16 flex justify-center gap-4">
      <AuthLoading>
        <Button size="lg">
          <Loader2 size={20} className="mr-2 animate-spin" /> Loading
        </Button>
      </AuthLoading>
      <Unauthenticated>
        <SignInButton size="lg" redirectTo="/portal">
          Sign In
        </SignInButton>
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
        <SignOutButton size="lg" variant="outline" />
      </Authenticated>
    </div>
  )
}
