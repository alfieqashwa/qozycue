"use client"

import { SignInButton } from "@/components/sign-button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export default function SignInPage() {
  return (
    <div className="container mx-auto my-auto flex min-h-screen w-full">
      <div className="mx-auto my-auto flex max-w-[384px] flex-col gap-4 pb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Sign in with Google
        </h2>
        <SignInButton variant="outline" redirectTo="/product">
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> Google
        </SignInButton>
      </div>
    </div>
  )
}
