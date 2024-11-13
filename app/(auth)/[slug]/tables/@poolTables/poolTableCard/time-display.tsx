import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function TimeDisplay({
  startTime,
  endTime,
}: {
  startTime: number | undefined
  endTime: number | undefined
}) {
  const defaultTimeDisplay = "--.--"
  const formattedStartTime = (
    <p className={cn("text-end tracking-tighter", startTime && "text-sky-400")}>
      {startTime ? format(startTime, "pp", { locale: id }) : defaultTimeDisplay}
    </p>
  )
  const formattedEndTime = (
    <p className={cn("text-end tracking-tighter", endTime && "text-amber-400")}>
      {endTime ? format(endTime, "pp", { locale: id }) : defaultTimeDisplay}
    </p>
  )

  return (
    <article className="mt-8 space-y-1 text-xs text-muted-foreground sm:text-sm">
      <p className="space-x-1 text-right capitalize leading-3">Start</p>
      {formattedStartTime}
      <p className="space-x-1 text-right capitalize leading-3">End</p>
      {formattedEndTime}
    </article>
  )
}
