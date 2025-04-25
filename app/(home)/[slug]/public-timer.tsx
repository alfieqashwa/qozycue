"use client"

import { cn } from "@/lib/utils"
import { ContactBooking } from "./contact-booking"

export function PublicTimer({
  isActive,
  poolTableName,
  hasEndTime,
  BOOKING,
  children,
}: {
  isActive: boolean
  poolTableName: string
  hasEndTime: boolean
  BOOKING: string
  children: React.ReactNode
}) {
  return (
    <div className="p-2">
      <div
        className={cn(
          "bg-primary/5 relative size-[6rem] shrink-0 rounded-full p-2 shadow-md",
          isActive &&
            "bg-primary/10 mx-1 ring-4 ring-offset-4 ring-offset-black",
          hasEndTime ? "ring-muted" : "ring-sky-400",
        )}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {isActive ? (
            children
          ) : (
            <ContactBooking BOOKING={BOOKING} poolTableName={poolTableName} />
          )}
        </div>
      </div>
    </div>
  )
}
