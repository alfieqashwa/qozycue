import "@/styles/globals.css"
export const dynamic = "force-dynamic"

import { Poppins as FontSans } from "next/font/google"

import ConvexClientProvider from "@/components/ConvexClientProvider"
import { ThemeProvider } from "@/components/providers"
import { cn } from "@/lib/utils"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
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
  description: "Pool Billiard & Cafe Online Application.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    url: new URL(baseUrl),
    images:
      "https://images.unsplash.com/photo-1584161786791-1657f4409456?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    authors: "alfieqashwa",
    description: "Billiard & Cafe Online Application.",
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
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
