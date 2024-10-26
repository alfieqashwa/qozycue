"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "../ui/button"

export type SignOutButtonProps = {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined

  size?: "default" | "sm" | "lg" | "icon" | null | undefined
}

export function SignOutButton({
  variant = "default",
  size = "default",
}: SignOutButtonProps) {
  const { signOut } = useAuthActions()
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => void signOut()}
    >
      Sign Out
    </Button>
  )
}
