"use client"

import { cn } from "@/lib/utils"
import { GiPoolTriangle } from "react-icons/gi"

type TimeCardProps = {
  hours: number | undefined
  minutes: number | undefined
  seconds: number | undefined
  className?: string
}

export function TimeCard({
  hours,
  minutes,
  seconds,
  className,
}: TimeCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-lg font-semibold",
        className,
      )}
    >
      <FormatTime time={hours} label="Hours" />
      <Divider />
      <FormatTime time={minutes} label="Mins" />
      <Divider />
      <FormatTime time={seconds} label="Secs" />
    </div>
  )
}

const FormatTime = ({
  time,
  label,
}: {
  time: number | undefined
  label?: string
}) => {
  // const singularLabel = label.slice(0, -1)
  return (
    <>
      <span className="sr-only">{label}</span>
      {typeof time !== "undefined" ? (
        <span>{time?.toString().padStart(2, "0")}</span>
      ) : (
        <GiPoolTriangle className="animate-pulse" />
      )}
      {/* <span>{time === 1 ? singularLabel : label}</span> */}
    </>
  )
}

const Divider = () => <span>:</span>
