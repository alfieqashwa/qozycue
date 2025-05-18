import { Poppins } from "next/font/google"

/*
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
*/

export const poppins = Poppins({
  // subsets: ["latin"],
  // variable: "--font-sans",
  subsets: ["latin-ext"],
  variable: "--font-sans",
  style: "normal",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
})
