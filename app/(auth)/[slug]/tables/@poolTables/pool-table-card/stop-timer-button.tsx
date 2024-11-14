"use client"

import { type Rate } from "@prisma/client"
import { Loader2, TimerOff } from "lucide-react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

export function StopTimerButton({
  isCashier,
  poolTableId,
  poolTableName,
  startTime,
  poolRentalId,
  packetRate,
  packetCost,
}: {
  isCashier: boolean
  poolTableId: string
  poolTableName: string
  startTime: Date | null
  poolRentalId?: string
  packetRate?: Rate
  packetCost?: number
}) {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.poolRental.stopTimer.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: <p>Table {poolTableName} has been stopped.</p>,
      })
      await utils.poolTable.invalidate()
      await utils.order.findByPoolTableId.invalidate({ poolTableId })
      await utils.order.findByPoolTableIdPublic.invalidate({ poolTableId })
      await utils.poolRental.countIsBooking.invalidate()
      /* auto-closed after succeed submit the dialog form */
      setOpen(false)
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    mutate({
      poolTableId,
      poolRentalId: poolRentalId as string,
      startTime: startTime as Date,
      endTime: new Date(),
      cost: packetCost as number,
      rate: packetRate as Rate,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!isCashier}
          variant="secondary"
          className="space-x-2 text-red-500 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <TimerOff size={20} />
          <span>Stop</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stop Table {poolTableName}</DialogTitle>
          <DialogDescription>
            Click Stop Timer when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <DialogFooter className="mt-12">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="mt-1.5 sm:mt-0"
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button disabled={isPending} type="submit">
                Stop Timer
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
