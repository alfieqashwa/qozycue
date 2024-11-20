import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlarmClock } from "lucide-react"
import { TimeCard } from "../timer/time-card"

export function StartAutomatically({
  stopCount,
  hours,
  minutes,
  seconds,
}: {
  stopCount: boolean
  hours: number | null
  minutes: number | null
  seconds: number | null
}) {
  return (
    <Badge variant="secondary" className="w-28 py-1">
      <AlarmClock
        size={18}
        className={cn(
          "mr-2 text-primary",
          hours === 0 && minutes! < 5 && "animate-bounce",
        )}
      />
      {!stopCount && (
        <TimeCard
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          className={cn(
            "pt-0.5 text-sm font-normal tracking-wider text-amber-400",
            hours === 0 && minutes! < 5 && "animate-pulse text-rose-500",
          )}
        />
      )}
    </Badge>
  )
}
