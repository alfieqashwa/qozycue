"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { BookingRentalTable } from "./booking-rental-table"
import { CreateBooking } from "./create-booking"
import { CreateBookingForm } from "./create-booking-form"
import { DisplayBookingTimer } from "./display-booking-timer"

export function Booking({
  isCashier,
  poolTableId,
  poolTableName,
  gapDuration,
  openAndNotBookingOrderId,
}: {
  isCashier: boolean
  poolTableId: Id<"poolTables">
  poolTableName: string
  gapDuration: number
  openAndNotBookingOrderId?: Id<"orders">
}) {
  const [openBooking, setOpenBooking] = useState(false)
  const [openWaitingList, setOpenWaitingList] = useState(false)

  // STARTS BOOKING AUTOMATICALLY
  const [stopCount, setStopCount] = useState(false)
  const [orderId, setOrderId] = useState<Id<"orders"> | undefined>(undefined)
  const [startTime, setStartTime] = useState<number | null | undefined>(
    undefined,
  )
  const [endTime, setEndTime] = useState<number | null | undefined>(undefined)
  const [hours, setHours] = useState<number | null>(null)
  const [minutes, setMinutes] = useState<number | null>(null)
  const [seconds, setSeconds] = useState<number | null>(null)

  const [findAllBookingByCompanyId, { data: countIsBooking, status }] =
    useTanstackQueries({
      queries: [
        {
          ...convexQuery(api.poolRentals.findAllBookingByPoolTableId, {
            poolTableId,
          }),
          enabled: !!poolTableId,
        },
        {
          ...convexQuery(api.poolRentals.countIsBooking, { poolTableId }),
          enabled: !!poolTableId,
        },
      ],
    })

  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.poolRentals.startBookingTimer),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Booking has been started automatically.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setStopCount(false),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        findAllBookingByCompanyId.status !== "success" ||
        !findAllBookingByCompanyId?.data
      ) {
        return
      }

      setOrderId(findAllBookingByCompanyId.data[0]?.order?.id)
      setStartTime(findAllBookingByCompanyId?.data[0]?.timeStart)
      setEndTime(findAllBookingByCompanyId?.data[0]?.timeEnd)

      if (!startTime || !endTime) return

      const now = Date.now()
      const difference = startTime - now

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      setHours(h)
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      setMinutes(m)
      const s = Math.floor((difference % (1000 * 60)) / 1000)
      setSeconds(s)

      // Only trigger the mutation once
      if (!stopCount && now >= startTime) {
        setStopCount(true) // Stop further execution within this interval

        mutate({
          startBookingTimerSchema: {
            openAndNotBookingOrderId,
            orderId: orderId as Id<"orders">,
            poolTableId,
            startTime,
            endTime,
          },
        })
      }
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    openAndNotBookingOrderId,
    poolTableId,
    findAllBookingByCompanyId.status,
    findAllBookingByCompanyId.data,
    startTime,
    endTime,
    orderId,
    stopCount,
    // mutate, //exclude mutate
  ])
  // ENDS BOOKING AUTOMATICALLY

  if (status === "success" && !!countIsBooking) {
    return (
      <Sheet open={openWaitingList} onOpenChange={setOpenWaitingList}>
        <TooltipIsBookingNotification
          count={countIsBooking}
          title="Waiting List"
          side={hours === 0 && minutes! < 5 ? "bottom" : "right"}
        >
          <SheetTrigger asChild className="bg-muted text-muted-foreground">
            <Button
              disabled={!isCashier || (!hours && !minutes && !seconds)}
              size="sm"
              className="duration absolute left-0 top-0 z-10 size-7 animate-pulse rounded-bl-none rounded-tl-2xl rounded-tr-none bg-primary/30 shadow-xl transition-opacity hover:bg-primary/50 disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <span className="text-xs font-bold capitalize text-primary">
                w
              </span>
            </Button>
          </SheetTrigger>
        </TooltipIsBookingNotification>
        {hours === 0 && minutes! < 5 && (
          <DisplayBookingTimer minutes={minutes!} seconds={seconds!} />
        )}
        <SheetContent side="top" className="-mx-2 md:-mx-0">
          <div className="mb-4">
            <CreateBooking poolTableId={poolTableId} />
          </div>
          <SheetHeader>
            <SheetTitle className="text-center text-xl font-semibold tracking-widest">
              Table {poolTableName}
            </SheetTitle>
          </SheetHeader>
          <GapDurationDescription gapDuration={gapDuration} />
          {findAllBookingByCompanyId.status === "success" &&
            !!findAllBookingByCompanyId.data && (
              <BookingRentalTable
                bookingList={findAllBookingByCompanyId.data}
                poolTableId={poolTableId}
                poolTableName={poolTableName}
                gapDuration={gapDuration}
                orderId={findAllBookingByCompanyId.data?.[0]?.order?.id}
                stopCount={stopCount}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
              />
            )}
          <SheetFooter>
            <SheetClose
              className={cn("mt-6", buttonVariants({ variant: "outline" }))}
            >
              Close
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={openBooking} onOpenChange={setOpenBooking}>
      <TooltipIsBookingNotification title="Booking?">
        <DrawerTrigger asChild className="bg-muted text-muted-foreground">
          <Button
            disabled={!isCashier}
            size="sm"
            className="absolute left-0 top-0 z-10 size-7 rounded-bl-none rounded-tl-2xl rounded-tr-none shadow-xl transition-all duration-500 ease-in-out hover:bg-primary/50 hover:text-foreground disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            <span className="text-xs font-bold capitalize">b</span>
          </Button>
        </DrawerTrigger>
      </TooltipIsBookingNotification>
      <CreateBookingForm
        poolTableId={poolTableId}
        poolTableName={poolTableName}
        gapDuration={gapDuration}
        setOpen={setOpenBooking}
      />
    </Drawer>
  )
}

const TooltipIsBookingNotification = ({
  count,
  title,
  side = "right",
  children,
}: {
  count?: number
  title: string
  side?: "left" | "right" | "top" | "bottom"
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} className="bg-muted">
      <p className="space-x-1 font-sans text-xs font-medium text-muted-foreground">
        <span>{count}</span>
        <span>{title}</span>
      </p>
    </TooltipContent>
  </Tooltip>
)

const GapDurationDescription = ({ gapDuration }: { gapDuration: number }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <SheetDescription className="animate-pulse-slow pb-2 pt-1 text-center text-xs font-medium capitalize tracking-widest text-primary hover:cursor-text md:pb-4 md:text-sm">
        gap duration time = {gapDuration} minutes
      </SheetDescription>
    </TooltipTrigger>
    <TooltipContent className="bg-muted">
      <p className="text-xs font-medium text-muted-foreground">
        Minimum time difference between each order
      </p>
    </TooltipContent>
  </Tooltip>
)
