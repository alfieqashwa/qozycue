import { AuthButtons } from "./auth-buttons";
import { ConvexLogo } from "./convex-logo";

export default function HomePage() {
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
        <AuthButtons />
      </div>
    </div>
  );
}
