"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"
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
      <motion.span
        aria-live="polite"
        aria-label={`${label}: ${display}`}
        className="countdown py-0.5"
        initial={{
          opacity: 0,
          x: -15,
        }}
        animate={{ opacity: 100, x: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
          ease: "easeOut",
        }}
        role="timer"
      >
        <span style={{ "--value": value } as React.CSSProperties}>
          {display}
        </span>
      </motion.span>
    )
  }

  return (
    <motion.div
      className={cn("flex items-center text-lg font-semibold", className)}
    >
      {renderSegment(hours, "Hours")}
      <span aria-hidden="true">:</span>
      {renderSegment(minutes, "Minutes")}
      <span aria-hidden="true">:</span>
      {renderSegment(seconds, "Seconds")}
    </motion.div>
  )
}
