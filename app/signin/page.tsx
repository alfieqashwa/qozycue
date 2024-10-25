"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full container my-auto mx-auto">
      <div className="max-w-[384px] mx-auto flex flex-col my-auto gap-4 pb-8">
        <h2 className="font-semibold text-2xl tracking-tight">
          Sign in with Google
        </h2>
        <SignInWithGoogle />
      </div>
    </div>
  );
}

function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("google", { redirectTo: "/product" })}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> Google
    </Button>
  );
}
