"use client"

export const ShimmerButton = ({ children }: { children?: React.ReactNode }) => {
  return (
    <button className="inline-flex h-11 animate-shimmer items-center justify-center rounded-md border-2 border-zinc-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-5 font-semibold text-foreground transition-colors focus:outline-hidden focus:ring-1 focus:ring-zinc-400 focus:ring-offset-1 focus:ring-offset-zinc-50">
      {children}
    </button>
  )
}

/*
     * tailwind.config.js code
    {
      "animation": {
        shimmer: "shimmer 2s linear infinite"
      },
      "keyframes": {
        shimmer: {
          from: {
            "backgroundPosition": "0 0"
          },
          to: {
            "backgroundPosition": "-200% 0"
          }
        }
      }
    }
  `,
*/
