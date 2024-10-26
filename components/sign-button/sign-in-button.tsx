"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "../ui/button"
import { SignOutButtonProps } from "./sign-out-button"

type SignInButtonProps = {
  redirectTo: string
  children: React.ReactNode
} & SignOutButtonProps

export function SignInButton({
  variant = "default",
  size = "default",
  redirectTo,
  children,
}: SignInButtonProps) {
  const { signIn } = useAuthActions()
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => void signIn("google", { redirectTo })}
    >
      {children}
    </Button>
  )
}
