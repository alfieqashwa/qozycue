import "@/styles/globals.css"
export const dynamic = "force-dynamic"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Poppins as FontSans } from "next/font/google"

import ConvexClientProvider from "@/components/ConvexClientProvider"
import { ThemeProvider } from "@/components/providers"
import { cn } from "@/lib/utils"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { CircleCheck, CircleX, Info } from "lucide-react"
import type { Metadata } from "next"
import { Toaster } from "sonner"

const fontSans = FontSans({
  // subsets: ["latin"],
  // variable: "--font-sans",
  subsets: ["latin-ext"],
  variable: "--font-sans",
  style: "normal",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
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
    url: new URL(baseUrl),
    // images:
    //   "https://images.unsplash.com/photo-1584161786791-1657f4409456?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: "/images/qozy-que.webp",
    authors: "alfieqashwa",
    description: "Billiard & Cafe Real Time Application.",
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
      <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
        <head />
        <body className={cn("font-sans antialiased", fontSans.variable)}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              themes={["light", "dark", "orange", "cherry", "fish"]}
              disableTransitionOnChange
            >
              <main className="mx-auto min-h-screen min-w-[360px] max-w-[2048px] bg-black">
                {children}
              </main>
              {/* // Todos
               <Analytics/ >
               <SpeedInsights /> */}
              <Toaster
                // richColors
                // bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70%
                position="top-right"
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    error:
                      "bg-red-950 border-2 border-black flex items-center w-full pl-2 py-3 rounded-lg shadow-lg",
                    info: "bg-yellow-600 border-2 border-yellow-900 flex items-center w-full pl-2 py-3 rounded-lg shadow-lg",
                    success:
                      "bg-emerald-950 border-2 border-black flex items-center w-full pl-2 py-3 rounded-lg shadow-lg",
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
                  // loading: <LoadingIcon />,
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
