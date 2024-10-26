"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const AuthButtons = () => {
  const { signIn, signOut } = useAuthActions();
  return (
    <div className="my-16 flex justify-center gap-4">
      <AuthLoading>
        <Button size="lg">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading
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
        <Button asChild size="lg">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button size="lg" variant="outline" onClick={() => void signOut()}>
          Sign Out
        </Button>
      </Authenticated>
    </div>
  );
};
