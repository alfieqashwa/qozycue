"use client";

import { Loader2 } from "lucide-react";
import { ConvexLogo } from "@/app/(home)/GetStarted/ConvexLogo";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";

export const GetStarted = () => {
  const { signIn, signOut } = useAuthActions();
  return (
    <div className="flex grow flex-col">
      <div className="container mb-20 flex grow flex-col justify-center">
        <h1 className="mt-16 flex flex-col items-center gap-8 text-center text-6xl font-extrabold leading-none tracking-tight">
          Qozy Cue
        </h1>
        <div className="my-6 text-center text-lg text-muted-foreground">
          Powered by
        </div>
        <div className="flex justify-center">
          <ConvexLogo width={377} height={44} />
        </div>
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
      </div>
    </div>
  );
};
