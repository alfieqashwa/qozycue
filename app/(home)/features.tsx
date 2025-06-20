"use client"

import {
  StickyScrollDesktopView,
  StickyScrollMobileView,
} from "@/components/ui/sticky-scroll-reveal"
import { Cog } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { PoolTableBarChartDashboard } from "../(auth)/[slug]/dashboard/overview/chart-list/pool-table-bar-chart"
import { POOL_TABLE_BAR } from "../constants/data"
import { useMediaQuery } from "../hooks/use-media-query"
import { SampleDateRangePicker } from "./sample-date-range-picker"
import { SamplePoolTableCard } from "./sample-pool-table-card"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      duration: 0.3,
    },
  },
}

const descriptionVariants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
}

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-black to-zinc-900 text-white"
        >
          <PoolTableBarChartDashboard
            data={POOL_TABLE_BAR}
            colorBar="fill-rose-600 motion-safe:animate-pulse-slow"
            country={country}
          />
        </motion.div>
      ),
    },
    {
      title: "Intuitive Design",
      description:
        "Desain antarmuka yang intuitif dan user-friendly, dengan lima pilihan tema warna, paket berbasis durasi (menit & jam), fitur transfer meja, pending payment, dan lainnya.",
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-black to-zinc-900 text-white"
        >
          <SamplePoolTableCard locale={country?.locale as string} />
        </motion.div>
      ),
    },
    {
      title: "Sustainable Maintenance",
      description:
        "Platform ini hadir sebagai solusi berkelanjutan untuk membantu para pengusaha biliar berkembang dan beradaptasi di era digital.",
      content: (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-black to-zinc-900"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Cog size={80} className="text-rose-600" />
          </motion.div>
          <motion.p
            variants={descriptionVariants}
            className="text-foreground text-xl font-medium"
          >
            We Do Not Sell Product
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: "Integrated System",
      description:
        "Sistem rental dan kasir terintegrasi ini memudahkan pengusaha biliar melacak omzet berdasarkan periode waktu yang fleksibel.",
      content: (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-black to-zinc-900 text-white"
        >
          <SampleDateRangePicker />
        </motion.div>
      ),
    },
    {
      title: "Secure",
      description:
        "Autentikasi pada platform ini didukung oleh protokol Google OAuth 2.0, yang memastikan tingkat keamanan tinggi bagi sistem dan pengguna.",
      content: (
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-black to-zinc-900"
        >
          <motion.p
            variants={descriptionVariants}
            className="text-foreground px-8 text-center text-xl font-medium text-balance"
          >
            "By utilizing the
            <motion.a
              whileHover={{
                scale: 1.05,
                color: "#fcd34d",
              }}
              href="https://datatracker.ietf.org/doc/html/rfc6749"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-amber-300/80 underline transition"
            >
              OAuth 2.0 protocol
            </motion.a>
            , we eliminate the need to store any passwords."
          </motion.p>
        </motion.div>
      ),
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-hidden p-0 sm:p-10"
    >
      <AnimatePresence mode="wait">
        {isDesktop ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StickyScrollDesktopView content={content} />
          </motion.div>
        ) : (
          <motion.div
            key="mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StickyScrollMobileView content={content} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
