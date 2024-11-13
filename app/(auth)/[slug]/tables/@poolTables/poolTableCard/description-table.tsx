import { api } from "@/convex/_generated/api"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { useEffect, useState } from "react"

export function DescriptionTable({
  poolTable,
  orderStatusSucceed,
  order,
}: {
  poolTable: FunctionReturnType<typeof api.pooltables.findAll>[0]
  orderStatusSucceed: boolean
  order: FunctionReturnType<typeof api.orders.findByPoolTableId> | undefined
}) {
  const { isActive, startTime, name: poolTableName } = poolTable
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
      if (order?.packet?.cost == null) return
      setRealtimeTotalCost(
        Math.round((order.packet.cost * realtimeDuration) / 100) * 100,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, order?.packet?.cost, setRealtimeDuration, startTime])

  const formattedRate = order?.packet?.rate === "HOUR" ? "hr" : "min"

  return (
    <section className="-ml-4">
      <h1
        className={cn(
          "text-center font-bold uppercase",
          isActive && orderStatusSucceed && order?.packet?.rate === "HOUR"
            ? "text-sky-400"
            : orderStatusSucceed && order?.packet?.rate === "MINUTE"
              ? "text-amber-400"
              : "text-muted-foreground",
        )}
      >
        Table {poolTableName}
      </h1>

      <article className="mt-1 grid grid-cols-2 gap-x-2 text-xs text-muted-foreground sm:text-sm">
        <p className="text-right">Packet:</p>
        {orderStatusSucceed && !!order?.packet?.name ? (
          <p className="capitalize text-foreground">{order.packet.name}</p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Cost:</p>
        {orderStatusSucceed && !!order?.packet?.cost ? (
          <p className="tracking-tight text-foreground">
            {formattedPrice.format(Number(order.packet.cost))}/
            <span>{formattedRate}</span>
          </p>
        ) : (
          <InvisibleParagraph />
        )}
        <p className="text-right">Duration:</p>
        {orderStatusSucceed && !!order?.poolRental?.duration ? (
          <p className="text-foreground">
            {order.poolRental.duration}
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
        {orderStatusSucceed && !!order?.poolRental?.totalCost ? (
          <p className="tracking-tight text-foreground">
            {formattedPrice.format(Number(order.poolRental.totalCost))}
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
