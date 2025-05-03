"use client"

import { cn } from "@/lib/utils"
import { useAuthActions } from "@convex-dev/auth/react"
import { Authenticated, AuthLoading } from "convex/react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

type SignOutButtonProps = {
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
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut().then(() => router.push("/"))
  }
  return (
    <>
      <AuthLoading>
        <LoaderButton size="sm" className="animate-spin" />
      </AuthLoading>
      <Authenticated>
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Authenticated>
    </>
  )
}

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

type LoaderButtonProps = {
  className?: string
} & SignOutButtonProps
export const LoaderButton = ({
  className,
  variant,
  size,
}: LoaderButtonProps) => (
  <Button variant={variant} size={size}>
    <Loader2 size={16} className={cn(className)} /> Loading
  </Button>
)
