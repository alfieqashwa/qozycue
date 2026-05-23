import ConvexClientProvider from "@/components/ConvexClientProvider"
import { Globe } from "@/components/magicui/globe"
import { ThemeProvider } from "@/components/providers"
import { cn } from "@/lib/utils"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CircleCheck, CircleX, Info } from "lucide-react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Toaster } from "sonner"
import "../styles/globals.css"

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-sans",
  style: "normal",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
})

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000"

/*
 * Note:
 * test Open Graph using terminal formard port
 * before deploy into production
 *  https://www.opengraph.xyz/
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Qozy Cue",
    default: "Qozy Cue",
  },
  robots: {
    follow: true,
    index: true,
  },
  description: "Billiard & Cafe Real Time Application.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Qozy Cue",
    description: "Billiard & Cafe Real Time Application.",
    authors: "alfieqashwa",
    url: new URL(baseUrl),
    images: "https://qozycue.vercel.app/opengraph-image.png",
    // "https://raw.githubusercontent.com/alfieqashwa/me/main/public/img/cover.webp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      {/* `suppressHydrationWarning` only affects the html tag,
      and is needed by `ThemeProvider` which sets the theme
      class attribute on it */}
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("scroll-smooth", poppins.variable)}
      >
        <body className="font-sans antialiased">
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              themes={["light", "dark", "cherry", "grape", "orange"]}
              disableTransitionOnChange
            >
              <main className="mx-auto min-h-screen max-w-[2048px] min-w-[360px] bg-black">
                {children}
              </main>
              <Toaster
                position="top-right"
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    error:
                      "bg-red-950 border-2 border-black flex items-center w-full pl-4 py-3 rounded-lg shadow-lg text-muted-foreground",
                    info: "bg-yellow-600 border-2 border-yellow-900 flex items-center text-muted-foreground w-full pl-4 py-3 rounded-lg shadow-lg",
                    success:
                      "bg-emerald-950 border-2 border-black flex items-center text-muted-foreground w-full pl-4 py-3 rounded-lg shadow-lg",
                    // warning: "bg-orange-400",
                    // toast: "bg-blue-400",
                    title: "pl-8 text-foreground font-medium tracking-wide",
                    description: "pl-8 text-muted-foreground text-sm",
                    // actionButton: "bg-zinc-400",
                    // cancelButton: "bg-orange-400",
                    // closeButton: "bg-lime-400",
                  },
                }}
                icons={{
                  success: (
                    <CircleCheck
                      size={28}
                      className="ml-2.5 animate-pulse rounded-full text-emerald-400 ring-4 ring-emerald-900"
                    />
                    // <CircleCheck
                    //   size={28}
                    //   strokeWidth={2.3}
                    //   className="ml-3 shrink-0 stroke-emerald-500"
                    // />
                  ),
                  info: (
                    <Info
                      size={28}
                      className="ml-2.5 animate-pulse rounded-full text-yellow-50 ring-4 ring-yellow-400"
                    />
                  ),
                  // warning: <WarningIcon />,
                  error: (
                    <CircleX
                      size={28}
                      className="ml-2.5 animate-pulse rounded-full text-red-600 ring-4 ring-red-900"
                    />
                  ),
                }}
              />
            </ThemeProvider>
          </ConvexClientProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
