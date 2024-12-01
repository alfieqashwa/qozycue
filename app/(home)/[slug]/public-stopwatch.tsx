"use client"

import { MAX_END_TIME } from "@/app/constants/max-duration"
import { useEffect, useState } from "react"
import { TimeCard } from "../../(auth)/[slug]/tables/pool-table-tab/pool-table-card/timer/time-card"

export function PublicStopwatch({
  isActive,
  startTime,
}: {
  isActive: boolean
  startTime: number | null
}) {
  const [stopCount, setStopCount] = useState(false)
  const [localTime, setLocalTime] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!isActive || !startTime) return

    const updateLocalTime = () => {
      const now = Date.now()
      const difference = now - startTime

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setLocalTime({ hours, minutes, seconds })

      const maximumEndTime = startTime + MAX_END_TIME

      if (now >= maximumEndTime) {
        setStopCount(true)
      }
    }

    const interval = setInterval(updateLocalTime, 1000)
    return () => clearInterval(interval)
  }, [isActive, startTime])
  return (
    <>
      {!stopCount && (
        <TimeCard
          hours={localTime?.hours as number}
          minutes={localTime?.minutes as number}
          seconds={localTime?.seconds as number}
          className="text-amber-400"
        />
      )}
    </>
  )
}
