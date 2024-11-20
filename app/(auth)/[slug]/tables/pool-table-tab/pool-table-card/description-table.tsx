import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { Rate } from "@/types"
import { useEffect, useState } from "react"

export function DescriptionTable({
  isActive,
  startTime,
  poolTableName,
  orderStatusSucceed,
  packetCost,
  packetRate,
  packetName,
  duration,
  totalCost,
}: {
  isActive: boolean
  startTime: number
  poolTableName: string
  orderStatusSucceed: boolean
  packetName?: string
  packetRate?: Rate
  packetCost?: number
  duration?: number | null
  totalCost?: number
}) {
  const [realtimeDuration, setRealtimeDuration] = useState<null | number>(null)
  const [realtimeTotalCost, setRealtimeTotalCost] = useState<null | number>(
    null,
  )

  useEffect(() => {
    if (isActive === false) {
      setRealtimeDuration(null)
      setRealtimeTotalCost(null)
    }
    const interval = setInterval(() => {
      if (isActive === false) return
      if (startTime == null) return

      const now = Date.now()
      const difference = now - startTime

      // for Card-Description
      const realtimeDuration = Math.floor(difference / (1000 * 60))
      setRealtimeDuration(realtimeDuration)
      if (packetCost == null) return
      setRealtimeTotalCost(
        Math.round((packetCost * realtimeDuration) / 100) * 100,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, packetCost, setRealtimeDuration, startTime])

  const formattedRate = packetRate === "HOUR" ? "hr" : "min"

  return (
    <section className="-ml-4">
      <h1
        className={cn(
          "text-center font-bold uppercase",
          isActive && orderStatusSucceed && packetRate === "HOUR"
            ? "text-sky-400"
            : orderStatusSucceed && packetRate === "MINUTE"
              ? "text-amber-400"
              : "text-muted-foreground",
        )}
      >
        Table {poolTableName}
      </h1>

      <article className="mt-1 grid grid-cols-2 gap-x-2 text-xs text-muted-foreground sm:text-sm">
        <p className="text-right">Packet:</p>
        {orderStatusSucceed && !!packetName ? (
          <p className="capitalize text-foreground">{packetName}</p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Cost:</p>
        {orderStatusSucceed && !!packetCost ? (
          <p className="tracking-tight text-foreground">
            {formattedPrice.format(Number(packetCost))}/
            <span>{formattedRate}</span>
          </p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Duration:</p>
        {orderStatusSucceed && !!duration ? (
          <p className="text-foreground">
            {duration}
            <span className="ml-1">{formattedRate}</span>
          </p>
        ) : isActive && !!realtimeDuration ? (
          <p className="text-amber-400">
            {realtimeDuration}
            <span className="ml-1">{formattedRate}</span>
          </p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Price:</p>
        {orderStatusSucceed && !!totalCost ? (
          <p className="tracking-tight text-foreground">
            {formattedPrice.format(Number(totalCost))}
          </p>
        ) : isActive && !!realtimeDuration ? (
          <p className="text-amber-400">
            {formattedPrice.format(Number(realtimeTotalCost))}
          </p>
        ) : (
          <InvisibleParagraph />
        )}
      </article>
    </section>
  )
}

const InvisibleParagraph = () => <p className="invisible">-</p>
