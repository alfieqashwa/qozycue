import { SignInButton } from "@/components/sign-button"
import { FcGoogle } from "react-icons/fc"

export default function SignInPage() {
  return (
    <div className="container mx-auto my-auto flex min-h-screen w-full">
      <div className="mx-auto my-auto flex max-w-[384px] flex-col gap-4 pb-8">
        <h2 className="whitespace-nowrap text-2xl font-semibold tracking-tight">
          Sign in with Google
        </h2>
        <SignInButton variant="outline" redirectTo="/portal">
          <FcGoogle size={20} className="mr-2" />
          <span className="whitespace-nowrap">Sign In</span>
        </SignInButton>
      </div>
    </div>
  )
}
