"use client"

import { Rate } from "@/types"
import { useEffect, useState } from "react"
import { TimeCard } from "./time-card"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ConvexError } from "convex/values"
import { MAX_END_TIME } from "@/app/constants/max-duration"
import { Id } from "@/convex/_generated/dataModel"

export function Stopwatch({
  isActive,
  poolTableId,
  poolTableName,
  poolRentalId,
  startTime,
  packetCost,
  packetRate,
}: {
  isActive: boolean
  poolTableId: Id<"poolTables">
  poolTableName: string
  poolRentalId?: Id<"poolRentals">
  startTime?: number
  packetCost?: number
  packetRate?: Rate
}) {
  const [stopCount, setStopCount] = useState(false)
  const [localTime, setLocalTime] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const stopTimerAutomatically = useMutation({
    mutationFn: useConvexMutation(api.orders.stopTimer),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been stopped automatically`,
      })
      setStopCount(false)
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

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

        stopTimerAutomatically.mutate({
          stopTimerSchema: {
            poolTableId,
            poolRentalId: poolRentalId!,
            startTime,
            endTime: maximumEndTime,
            cost: packetCost as number,
            rate: packetRate as Rate,
          },
        })
      }
    }
    const interval = setInterval(updateLocalTime, 1000)
    return () => clearInterval(interval)
  }, [
    isActive,
    packetCost,
    packetRate,
    poolRentalId,
    poolTableId,
    startTime,
    stopTimerAutomatically,
  ])

  return (
    <>
      {!stopCount && (
        <TimeCard
          hours={localTime?.hours}
          minutes={localTime?.minutes}
          seconds={localTime?.seconds}
          className="text-amber-400"
        />
      )}
    </>
  )
}
