import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Rate } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { type CSSProperties, useEffect, useState } from "react"
import { toast } from "sonner"
import { TimeCard } from "./time-card"
import { UpdateDuration } from "./update-duration"

type CountdownProps = {
  endTime: number | null
  poolTableId: Id<"poolTables">
  poolTableName: string
  startTime: number | null
  poolRentalId?: Id<"poolRentals">
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

  const stopTimerAutomatically = useMutation({
    mutationFn: useConvexMutation(api.orders.stopTimer),
    onSuccess() {
      toast.success("Succeed!", {
        description: (
          <p>Table {poolTableName} has been stopped automatically.</p>
        ),
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
    if (!endTime || !startTime) return

    const updateLocalTime = () => {
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

        stopTimerAutomatically.mutate({
          stopTimerSchema: {
            poolTableId,
            poolRentalId: poolRentalId!,
            startTime,
            endTime,
            cost: packetCost!,
            rate: packetRate!,
          },
        })
      }
    }
    const interval = setInterval(updateLocalTime, 1000)
    return () => clearInterval(interval)
  }, [
    endTime,
    packetCost,
    packetRate,
    poolRentalId,
    poolTableId,
    startTime,
    stopTimerAutomatically,
  ])

  return (
    <>
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
          {!!duration && (
            <UpdateDuration
              poolTableId={poolTableId}
              poolTableName={poolTableName}
              poolRentalId={poolRentalId}
              duration={duration}
            />
          )}
          <p className="absolute top-7 -translate-x-1/2">
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
