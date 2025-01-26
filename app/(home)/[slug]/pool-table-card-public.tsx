"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { DescriptionTable } from "../../(auth)/[slug]/tables/pool-table-tab/pool-table-card/description-table"
import { TimeDisplay } from "../../(auth)/[slug]/tables/pool-table-tab/pool-table-card/time-display"
import { ContactBooking } from "./contact-booking"
import { PublicCountdown } from "./public-count-down"
import { PublicStopwatch } from "./public-stopwatch"
import { PublicTimer } from "./public-timer"
import { WaitingListDrawer } from "./waiting-list-drawer"

export function PoolTableCardPublic({
  companyName,
  companyPhone,
  poolTableId,
  poolTableName,
  poolTableStartTime,
  poolTableEndTime,
  isActive,
}: {
  companyName: string
  companyPhone: string
  poolTableId: Id<"poolTables">
  poolTableName: string
  poolTableStartTime: number
  poolTableEndTime: number
  isActive: boolean
}) {
  const pathname = usePathname()
  const order = useTanstackQuery({
    ...convexQuery(api.orders.findByPoolTableIdPublicProcedure, {
      poolTableId,
    }),

    enabled: Boolean(poolTableId),
  })

  const websitelink = `https://qozycue.com${pathname}` // pathname has included the "/"
  const SPACE = "%20"
  const BOOKING = `https://wa.me/${companyPhone}?text=Hi${SPACE}${companyName.toLocaleUpperCase()}.${SPACE}Saya${SPACE}mau${SPACE}pesan${SPACE}meja${SPACE}${poolTableName}.${SPACE}Bagaimana${SPACE}cara${SPACE}pembayarannya?${SPACE}Thanks!${SPACE}${websitelink}`

  return (
    <div className="group/card relative">
      <div
        className={cn(
          "group-transition-colors absolute -inset-[1px] h-44 w-full rounded-2xl duration-500 ease-in-out",
          !isActive &&
            !poolTableStartTime &&
            !poolTableEndTime &&
            "bg-zinc-900 blur-md group-hover/card:bg-zinc-800 group-hover/card:shadow-lg group-hover/card:blur-lg",
          isActive &&
            poolTableStartTime &&
            "bg-sky-400 blur-md group-hover/card:blur-lg",
          !isActive &&
            !!poolTableStartTime &&
            "bg-amber-300 blur-sm group-hover/card:blur-md",
        )}
      />
      <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70% p-3 shadow">
        <section className="flex justify-between">
          <PublicTimer
            isActive={isActive}
            poolTableName={poolTableName}
            hasEndTime={!!poolTableEndTime}
            BOOKING={BOOKING}
          >
            {order.status === "success" &&
              order.data?.poolRental?.packet.rate === "HOUR" && (
                <PublicCountdown
                  endTime={poolTableEndTime}
                  startTime={poolTableStartTime}
                />
              )}
            {order.status === "success" &&
              order.data?.poolRental?.packet.rate === "MINUTE" && (
                <PublicStopwatch
                  isActive={isActive}
                  startTime={poolTableStartTime}
                />
              )}
          </PublicTimer>
          <DescriptionTable
            isActive={isActive}
            startTime={poolTableStartTime}
            poolTableName={poolTableName}
            orderStatusSucceed={order.status === "success"}
            packetName={order.data?.poolRental?.packet.name}
            packetCost={order.data?.poolRental?.packet.cost}
            packetRate={order.data?.poolRental?.packet.rate}
            duration={order.data?.poolRental?.duration}
            totalCost={order.data?.poolRental?.totalCost}
          />
          <TimeDisplay
            startTime={poolTableStartTime}
            endTime={poolTableEndTime}
          />
        </section>
        <WaitingListDrawer
          poolTableId={poolTableId}
          poolTableName={poolTableName}
        />
      </div>
      {isActive && (
        <div className="absolute bottom-3 right-3">
          <ContactBooking
            BOOKING={BOOKING}
            poolTableName={poolTableName}
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  )
}
