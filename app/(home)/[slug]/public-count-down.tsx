"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { type CSSProperties, useEffect, useState } from "react"
import { TimeCard } from "../../(auth)/[slug]/tables/pool-table-tab/pool-table-card/timer/time-card"

export function PublicCountdown({
  endTime,
  startTime,
}: {
  endTime: number | null
  startTime: number | null
}) {
  const [stopCount, setStopCount] = useState(false)
  const [percentageRemaining, setPercentageRemaining] = useState(0)
  const [localTime, setLocalTime] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const updateLocalTime = () => {
      if (endTime == null) return
      if (startTime == null) return

      const now = Date.now()
      const difference = endTime - now

      // find the percentage time:
      const totalTime = endTime - startTime
      const percentage = (difference / totalTime) * 100
      setPercentageRemaining(Math.floor(percentage))

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setLocalTime({ hours, minutes, seconds })

      if (now >= endTime) {
        setStopCount(true)
      }
    }

    const interval = setInterval(updateLocalTime, 1000)
    return () => clearInterval(interval)
  }, [endTime, startTime])

  return (
    <>
      <motion.div
        className={cn(
          "radial-progress absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400",
          localTime?.hours === 0 && localTime.minutes < 5 && "text-rose-500",
        )}
        role="progressbar"
        style={
          {
            "--value": percentageRemaining,
            "--size": "7.05rem",
            "--thickness": "0.25rem",
          } as CSSProperties
        }
        initial={{ "--value": 0 }}
        animate={{ "--value": percentageRemaining }}
        transition={{
          delay: 0.5,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <p className="mt-14">
          <span
            className={cn(
              "text-sm font-semibold tracking-wider text-amber-300",
              localTime?.hours === 0 &&
                localTime.minutes < 5 &&
                "animate-pulse text-rose-500",
              percentageRemaining < 1 && "hidden",
            )}
          >
            {percentageRemaining}%
          </span>
        </p>
      </motion.div>
      {!stopCount && (
        <TimeCard
          hours={localTime?.hours as number}
          minutes={localTime?.minutes as number}
          seconds={localTime?.seconds as number}
          className={cn(
            "text-sky-400",
            localTime?.hours === 0 &&
              localTime.minutes < 5 &&
              "animate-pulse text-rose-500",
          )}
        />
      )}
    </>
  )
}
