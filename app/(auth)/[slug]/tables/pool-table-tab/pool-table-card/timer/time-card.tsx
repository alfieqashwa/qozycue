"use client"

import { cn } from "@/lib/utils"
import { GiPoolTriangle } from "react-icons/gi"

type TimeCardProps = {
  hours: number | null
  minutes: number | null
  seconds: number | null
  className?: string
}

export function TimeCard({
  hours,
  minutes,
  seconds,
  className,
}: TimeCardProps) {
  const renderSegment = (value: number | null, label: string) => {
    if (value == null) {
      return <GiPoolTriangle className="animate-pulse" />
    }
    const display = value.toString().padStart(2, "0")
    return (
      <span
        className="countdown py-0.5 text-lg"
        aria-live="polite"
        aria-label={`${label}: ${display}`}
      >
        <span style={{ "--value": value } as React.CSSProperties}>
          {display}
        </span>
      </span>
    )
  }

  return (
    <div role="timer" className={cn("flex items-center font-bold", className)}>
      {renderSegment(hours, "Hours")}
      <span aria-hidden="true">:</span>
      {renderSegment(minutes, "Minutes")}
      <span aria-hidden="true">:</span>
      {renderSegment(seconds, "Seconds")}
    </div>
  )
}
