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
  locale,
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
  locale: string
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

  // "text-sky-400": isActive && orderStatusSucceed && packetRate === "HOUR"
  //  "text-amber-400": orderStatusSucceed && packetRate === "MINUTE"
  return (
    <section className="-ml-4">
      <h1
        className={cn("text-muted-foreground text-center font-bold uppercase", {
          "text-sky-400": orderStatusSucceed && packetRate === "HOUR",
          "text-amber-400": orderStatusSucceed && packetRate === "MINUTE",
        })}
      >
        Table {poolTableName}
      </h1>

      <article className="text-muted-foreground mt-1 grid grid-cols-2 gap-x-2 text-xs sm:text-sm">
        <p className="text-right">Packet:</p>
        {orderStatusSucceed && !!packetName ? (
          <p className="text-foreground capitalize">{packetName}</p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Cost:</p>
        {orderStatusSucceed && !!packetCost ? (
          <p className="text-foreground tracking-tight">
            {formattedPrice(locale).format(Number(packetCost))}/
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
          <p className="text-foreground tracking-tight">
            {formattedPrice(locale).format(Number(totalCost))}
          </p>
        ) : isActive && !!realtimeDuration ? (
          <p className="text-amber-400">
            {formattedPrice(locale).format(Number(realtimeTotalCost))}
          </p>
        ) : (
          <InvisibleParagraph />
        )}
      </article>
    </section>
  )
}

const InvisibleParagraph = () => <p className="invisible">-</p>
