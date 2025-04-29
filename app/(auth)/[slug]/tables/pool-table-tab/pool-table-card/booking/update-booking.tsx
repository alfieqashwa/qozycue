"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { FilePlus2, Loader2 } from "lucide-react"
import { useState } from "react"
import { UpdateBookingForm } from "./update-booking-form"

type UpdateBookingProps = {
  orderId: Id<"orders">
  poolTableId: Id<"poolTables">
  poolTableName: string
  gapDuration: number
  packetId: Id<"packets">
  startTime: number
  duration: number
  totalCost: number
  customerName?: string
  customerPhone?: string | null
}
export const UpdateBooking = ({
  orderId,
  poolTableId,
  poolTableName,
  gapDuration,
  packetId,
  startTime,
  duration,
  totalCost,
  customerName,
  customerPhone,
}: UpdateBookingProps) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const content = {
    trigger: "Update",
    title: `Update Booking Table ${poolTableName}`,
    description: `Minimal ${gapDuration} minutes duration gap`,
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          <FilePlus2 className="group-hover:text-primary size-4" />
          <span>{content.trigger}</span>
        </DialogTrigger>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription className="text-amber-300">
              {content.description}
            </DialogDescription>
          </DialogHeader>
          <UpdateBookingForm
            orderId={orderId}
            poolTableId={poolTableId}
            poolTableName={poolTableName}
            gapDuration={gapDuration}
            packetId={packetId}
            startTime={startTime}
            duration={duration}
            totalCost={totalCost}
            customerName={customerName}
            customerPhone={customerPhone}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "hover:bg-accent flex w-full items-center rounded pl-2 disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <FilePlus2
          size={16}
          className="text-muted-foreground group-hover:text-primary"
        />
        <span className="text-xs">{content.trigger}</span>
      </DrawerTrigger>
      <DrawerContent className="bg-card mx-auto max-w-xl min-w-[360px] px-6">
        <DrawerHeader>
          <DrawerTitle>{content.title}</DrawerTitle>
          <DrawerDescription className="text-amber-300">
            {content.description}
          </DrawerDescription>
        </DrawerHeader>
        <UpdateBookingForm
          orderId={orderId}
          poolTableId={poolTableId}
          poolTableName={poolTableName}
          gapDuration={gapDuration}
          packetId={packetId}
          startTime={startTime}
          duration={duration}
          totalCost={totalCost}
          customerName={customerName}
          customerPhone={customerPhone}
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  )
}

export const BookingDialogFooter = ({
  isPending,
  packetIdWatch,
  durationWatch,
}: {
  isPending: boolean
  packetIdWatch: string
  durationWatch: number
}) => (
  <DialogFooter className="pt-8">
    <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
      Cancel
    </DialogClose>
    {isPending ? (
      <Button type="button" disabled>
        <Loader2 className="size-4 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button
        disabled={!packetIdWatch || durationWatch === 0}
        type="submit"
        className="disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        Update Booking
      </Button>
    )}
  </DialogFooter>
)

export const BookingDrawerFooter = ({
  isPending,
  packetIdWatch,
  durationWatch,
}: {
  isPending: boolean
  packetIdWatch: string
  durationWatch: number
}) => (
  <DrawerFooter className="-mx-6 pt-8">
    <DrawerClose className={cn(buttonVariants({ variant: "outline" }))}>
      Cancel
    </DrawerClose>
    {isPending ? (
      <Button disabled>
        <Loader2 className="size-4 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button
        disabled={!packetIdWatch || durationWatch === 0}
        type="submit"
        className="disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        Update Booking
      </Button>
    )}
  </DrawerFooter>
)
