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
        "Platform kami berbasis Cloud System sehingga Owner dapat melihat setiap proses transaksi secara real-time; kapan pun dan dimana pun melalui device mobile, tablet, ataupun desktop.",
      content: (
        <div className="text-foreground flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--zinc-900),var(--black))] text-xl font-semibold">
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
        "Desain tampilan intuitif dan mudah digunakan. Tersedia 5 theme warna pilihan, paket berdasarkan rate (minute & hourly), transfer meja, pending-payment, dan fitur-fitur lainnya.",
      content: <SamplePoolTableCard locale={country?.locale as string} />,
    },
    {
      title: "Sustainable Maintenance",
      description:
        "Platform ini diciptakan sebagai jembatan agar kami dapat memberikan pelayanan secara berkesinambungan dalam membantu para pengusaha billiard.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[linear-gradient(to_bottom_right,var(--black),var(--zinc-950))]">
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
        "Perpaduan sistem rental dan kasir yang terintegrasi, memudahkan para pengusaha billiard untuk mengetahui omzet dalam rentang waktu yang dapat di atur sendiri sesuai kebutuhan.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--black),var(--zinc-900))] text-white">
          <SampleDateRangePicker />
        </div>
      ),
    },
    {
      title: "Secure",
      description:
        "Kami mengandalkan protokol Google OAuth 2.0 untuk autentikasi - yang bukan hanya aman bagi sistem kami, namun juga bagi para pengguna.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--black),var(--zinc-900))]">
          <p className="text-foreground px-8 text-center text-xl font-medium text-balance">
            &quot;By utilizing the
            <a
              href="https://datatracker.ietf.org/doc/html/rfc6749"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-amber-300/80 underline transition hover:text-amber-300"
            >
              OAuth 2.0 protocol
            </a>
            , we eliminate the need to store any passwords.&quot;
          </p>
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
