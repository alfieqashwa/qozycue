"use client"

import {
  StickyScrollDesktopView,
  StickyScrollMobileView,
} from "@/components/ui/sticky-scroll-reveal"
import { Cog } from "lucide-react"
import { PoolTableBarChartDashboard } from "../(auth)/[slug]/dashboard/overview/chart-list/pool-table-bar-chart"
import { POOL_TABLE_BAR } from "../constants/data"
import { useMediaQuery } from "../hooks/use-media-query"
import { SampleDateRangePicker } from "./sample-date-range-picker"
import { SamplePoolTableCard } from "./sample-pool-table-card"
import { motion } from "motion/react"

export function Features() {
  const country = {
    code: "ID",
    country: "Indonesia",
    currency: "IDR",
    locale: "ID",
    flag: "flag",
  }

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const content = [
    {
      title: "Real Time Dashboard",
      description:
        "Dengan sistem berbasis cloud, pemilik usaha dapat memantau seluruh transaksi secara real-time, dari mana saja dan kapan saja, menggunakan perangkat mobile, tablet, atau desktop.",
      content: (
        <div className="text-foreground flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-xl font-semibold">
          <PoolTableBarChartDashboard
            data={POOL_TABLE_BAR}
            colorBar="fill-rose-600 motion-safe:animate-pulse-slow"
            country={country}
          />
        </div>
      ),
    },
    {
      title: "Intuitive Design",
      description:
        "Desain antarmuka yang intuitif dan user-friendly, dengan lima pilihan tema warna, paket berbasis durasi (menit & jam), fitur transfer meja, pending payment, dan lainnya.",
      content: (
        <div className="text-foreground flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-xl font-semibold">
          <SamplePoolTableCard locale={country?.locale as string} />
        </div>
      ),
    },
    {
      title: "Sustainable Maintenance",
      description:
        "Platform ini hadir sebagai solusi berkelanjutan untuk membantu para pengusaha biliar berkembang dan beradaptasi di era digital.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-zinc-900 to-black">
          <Cog size={80} className="text-rose-600 motion-safe:animate-spin" />
          <p className="text-foreground text-xl font-medium">
            We Do Not Sell Product
          </p>
        </div>
      ),
    },
    {
      title: "Integrated System",
      description:
        "Sistem rental dan kasir terintegrasi ini memudahkan pengusaha biliar melacak omzet berdasarkan periode waktu yang fleksibel.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white">
          <SampleDateRangePicker />
        </div>
      ),
    },
    {
      title: "Secure",
      description:
        "Autentikasi pada platform ini didukung oleh protokol Google OAuth 2.0, yang memastikan tingkat keamanan tinggi bagi sistem dan pengguna.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-foreground px-8 text-center text-xl font-medium text-balance"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              &quot;By utilizing the
            </motion.span>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, color: "rgba(249, 115, 22, 0.8)" }}
              href="https://datatracker.ietf.org/doc/html/rfc6749"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-amber-300/80 underline transition"
            >
              OAuth 2.0 protocol
            </motion.a>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              , we eliminate the need to store any passwords.&quote;
            </motion.span>
          </motion.p>
        </div>
      ),
    },
  ]
  if (isDesktop) {
    return (
      <div className="p-0 sm:p-10">
        <StickyScrollDesktopView content={content} />
      </div>
    )
  }
  return (
    <div className="p-0 sm:p-10">
      <StickyScrollMobileView content={content} />
    </div>
  )
}
