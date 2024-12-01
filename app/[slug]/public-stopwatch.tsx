"use client"

import { type Rate } from "@prisma/client"
import { useEffect, useState } from "react"
import { TimeCard } from "~/app/(auth)/[slug]/tables/pool-table-tab/pool-table-card/timer/time-card"
import { MAX_END_TIME } from "~/app/constants/max-duration"

export function PublicStopwatch({
  isActive,
  poolTableId,
  poolRentalId,
  startTime,
  packetCost,
  packetRate,
}: {
  isActive: boolean
  poolTableId: string
  poolRentalId?: string
  startTime?: Date
  packetCost?: number
  packetRate?: Rate
}) {
  const [stopCount, setStopCount] = useState(false)
  const [hours, setHours] = useState<number | undefined>(undefined)
  const [minutes, setMinutes] = useState<number | undefined>(undefined)
  const [seconds, setSeconds] = useState<number | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive === false) return
      if (startTime == null) return

      const now = new Date()
      const difference = now.getTime() - startTime.getTime()
      const endTime = new Date(startTime.getTime() + MAX_END_TIME)

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      setHours(h)
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      setMinutes(m)
      const s = Math.floor((difference % (1000 * 60)) / 1000)
      setSeconds(s)

      if (now.getTime() >= endTime.getTime()) {
        setStopCount(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, packetCost, packetRate, poolRentalId, poolTableId, startTime])
  return (
    <>
      {!stopCount && (
        <TimeCard
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          className="text-amber-400"
        />
      )}
    </>
  )
}
