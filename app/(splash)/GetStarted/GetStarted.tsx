import { ConvexLogo } from "@/app/(splash)/GetStarted/ConvexLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const GetStarted = () => {
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
          <Button asChild size="lg">
            <Link href="/product">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://docs.convex.dev/home">Sign Out</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
