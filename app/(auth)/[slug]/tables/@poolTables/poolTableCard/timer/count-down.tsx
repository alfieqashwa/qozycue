"use client"

import { type CSSProperties, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { TimeCard } from "./time-card"
import { UpdateDuration } from "./update-duration"
import { Rate } from "@/types"
import { toast } from "sonner"

type CountdownProps = {
  endTime?: number
  poolTableId: string
  poolTableName: string
  startTime?: number
  poolRentalId?: string
  packetRate?: Rate
  packetCost?: number
  duration?: number
}

export function Countdown({
  endTime,
  poolTableId,
  poolTableName,
  startTime,
  poolRentalId,
  packetRate,
  packetCost,
  duration,
}: CountdownProps) {
  const [stopCount, setStopCount] = useState(false)
  const [percentageRemaining, setPercentageRemaining] = useState(0)
  const [localTime, setLocalTime] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  // const stopTimerAutomatically = api.poolRental.stopTimer.useMutation({
  //   async onSuccess() {
  //     toast.success("Succeed!", {
  //       description: (
  //         <p>Table {poolTableName} has been stopped automatically.</p>
  //       ),
  //     })
  //     setStopCount(false)
  //   },
  //   onError(err) {
  //     toast.error("Something went wrong.", {
  //       description: err.message || "There was a problem with your request.",
  //     })
  //   },
  // })

  // useEffect(() => {
  //   if (!endTime || !startTime) return

  //   const updateLocalTime = () => {
  //     const now = Date.now()
  //     const difference = endTime.getTime() - now

  //     // find the percentage time:
  //     const totalTime = endTime.getTime() - startTime?.getTime()
  //     const percentage = (difference / totalTime) * 100
  //     setPercentageRemaining(Math.floor(percentage))

  //     const hours = Math.floor(
  //       (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  //     )
  //     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  //     const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  //     setLocalTime({ hours, minutes, seconds })

  //     if (now >= endTime.getTime()) {
  //       setStopCount(true)

  //       stopTimerAutomatically.mutate({
  //         poolTableId,
  //         poolRentalId: poolRentalId as string,
  //         startTime: startTime,
  //         endTime,
  //         cost: packetCost as number,
  //         rate: packetRate as Rate,
  //       })
  //     }
  //   }
  //   const interval = setInterval(updateLocalTime, 1000)
  //   return () => clearInterval(interval)
  // }, [
  //   endTime,
  //   packetCost,
  //   packetRate,
  //   poolRentalId,
  //   poolTableId,
  //   startTime,
  //   stopTimerAutomatically,
  // ])
  // last useEffect dependencies -> isActive, endTime, stopCount
  return (
    <>
      <div>countdown</div>
      <div
        className={cn(
          "group radial-progress absolute inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400",
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
      >
        <div className="relative">
          {/* {!!duration && (
            <UpdateDuration
              poolTableId={poolTableId}
              poolTableName={poolTableName}
              poolRentalId={poolRentalId}
              duration={duration}
            />
          )} */}
          <p className="absolute top-4 -translate-x-1/2">
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
        </div>
      </div>
      {!stopCount && (
        <TimeCard
          hours={localTime?.hours}
          minutes={localTime?.minutes}
          seconds={localTime?.seconds}
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
