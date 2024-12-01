"use client"

import { type Rate } from "@prisma/client"
import { type CSSProperties, useEffect, useState } from "react"
import { TimeCard } from "~/app/(auth)/[slug]/tables/pool-table-tab/pool-table-card/timer/time-card"
import { cn } from "~/lib/utils"

export function PublicCountdown({
  endTime,
  poolTableId,
  startTime,
  poolRentalId,
  packetRate,
  packetCost,
}: {
  endTime?: Date
  poolTableId: string
  startTime: Date | null
  poolRentalId?: string
  packetRate?: Rate
  packetCost?: number
}) {
  const [stopCount, setStopCount] = useState(false)
  const [percentageRemaining, setPercentageRemaining] = useState(0)
  const [hours, setHours] = useState<number | undefined>(undefined)
  const [minutes, setMinutes] = useState<number | undefined>(undefined)
  const [seconds, setSeconds] = useState<number | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      if (endTime == null) return
      if (startTime == null) return

      const now = new Date()
      const difference = endTime.getTime() - now.getTime()

      // find the percentage time:
      const totalTime = endTime.getTime() - startTime?.getTime()
      const percentage = (difference / totalTime) * 100
      setPercentageRemaining(Math.floor(percentage))

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      setHours(h)
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      setMinutes(m)
      const s = Math.floor((difference % (1000 * 60)) / 1000)
      setSeconds(s)

      if (h <= 0 && m <= 0 && s <= 0) {
        setStopCount(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime, packetCost, packetRate, poolRentalId, poolTableId, startTime])
  return (
    <>
      <div
        className={cn(
          "radial-progress absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400",
          hours === 0 && minutes! < 5 && "text-rose-500",
        )}
        role="progressbar"
        style={
          {
            "--value": percentageRemaining,
            "--size": "7.05rem",
            "--thickness": "0.25rem",
          } as CSSProperties
        }
      >
        <p className="mt-14">
          <span
            className={cn(
              "text-sm font-semibold tracking-wider text-amber-300",
              hours === 0 && minutes! < 5 && "animate-pulse text-rose-500",
              percentageRemaining < 1 && "hidden",
            )}
          >
            {percentageRemaining}%
          </span>
        </p>
      </div>
      {!stopCount && (
        <TimeCard
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          className={cn(
            "text-sky-400",
            hours === 0 && minutes! < 5 && "animate-pulse text-rose-500",
          )}
        />
      )}
    </>
  )
}
