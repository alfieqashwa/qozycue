"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { Rate } from "@/types"
import { Id } from "@/convex/_generated/dataModel"

type PoolRentalDetailProps = {
  isActive: boolean
  packetName?: string
  packetRate?: Rate
  packetCost?: number
  duration?: number
  totalCost?: number
  startTime?: number
  endTime?: number
  timeStart?: number
  timeEnd?: number
  poolRentalId?: Id<"poolRentals">
  createdBy?: string
  createdAt?: number
}

export function PoolRentalDetail({
  isActive,
  packetName,
  packetCost,
  packetRate,
  duration,
  totalCost,
  startTime,
  endTime,
  timeStart,
  timeEnd,
  poolRentalId,
  createdBy,
  createdAt,
}: PoolRentalDetailProps) {
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
      if (!packetCost) return
      setRealtimeTotalCost(
        Math.round((packetCost * realtimeDuration) / 100) * 100,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, packetCost, setRealtimeDuration, startTime])

  const formattedPacketCost = formattedPrice.format(Number(packetCost))
  const formattedRate = packetRate === "HOUR" ? "hr" : "min"
  const formattedTotalCost = formattedPrice.format(Number(totalCost))
  const formattedRealtimeTotalCost = formattedPrice.format(
    Number(realtimeTotalCost),
  )

  //? START & END TIME CONFIGURATION
  const defaultTimeDisplay = "--.--"
  /*
    ? it will be no need to props the startTime when the API startTimer & stopTimer have been modified,
    ? because both Hourly & Minute rate will be created when start the timer button. (written on Sept 10, 2024)
   */
  const setStartTime = timeStart ?? startTime
  const setEndTime = timeEnd ?? endTime

  const formattedStartTime = (
    <p className={cn(setStartTime && "text-sky-400")}>
      {setStartTime
        ? format(setStartTime, "pp", { locale: id })
        : defaultTimeDisplay}
    </p>
  )
  const formattedEndTime = (
    <p className={cn(setEndTime && "text-amber-400")}>
      {setEndTime
        ? format(setEndTime, "pp", { locale: id })
        : defaultTimeDisplay}
    </p>
  )
  const formattedCreatedAt = (
    <p className="whitespace-nowrap">
      {createdAt
        ? format(createdAt, "PPPP", { locale: id })
        : defaultTimeDisplay}
    </p>
  )

  return (
    <ScrollArea className="-mx-4 h-[calc(100vh_-_20.725rem)] px-4">
      <WrapperDiv>
        <p className="text-muted-foreground">Rental ID:</p>
        {poolRentalId && (
          <p className="text-muted-foreground">
            {poolRentalId.slice(-8, poolRentalId.length)}
          </p>
        )}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Date:</p>
        {formattedCreatedAt}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Packet:</p>
        {packetName && (
          <p className="capitalize text-foreground">{packetName}</p>
        )}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Cost:</p>
        {!!packetCost ? (
          <p className="text-foreground">
            {formattedPacketCost}/<span>{formattedRate}</span>
          </p>
        ) : (
          <p className="text-muted-foreground">-</p>
        )}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Duration:</p>
        {!!duration ? (
          <p className="text-foreground">
            {duration}
            <span className="ml-1">{formattedRate}</span>
          </p>
        ) : isActive && !!realtimeDuration ? (
          <p className="text-amber-400">
            {realtimeDuration}
            <span className="ml-1">{formattedRate}</span>
          </p>
        ) : null}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Price:</p>
        {!!totalCost ? (
          <p className="text-foreground">{formattedTotalCost}</p>
        ) : isActive && !!realtimeDuration ? (
          <p className="text-amber-400">{formattedRealtimeTotalCost}</p>
        ) : null}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Start:</p>
        {formattedStartTime}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">End:</p>
        {formattedEndTime}
      </WrapperDiv>
      <Separator className="my-0.5" />
      <WrapperDiv>
        <p className="text-muted-foreground">Created By:</p>
        {!!createdBy ? (
          <span className="capitalize">{createdBy}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </WrapperDiv>
      <Separator className="my-0.5" />
    </ScrollArea>
  )
}

const WrapperDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-1 text-sm font-medium md:py-2 md:text-base">
    {children}
  </div>
)
