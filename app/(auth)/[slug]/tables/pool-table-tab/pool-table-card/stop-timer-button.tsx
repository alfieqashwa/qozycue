import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Rate } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, TimerOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

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
  poolTableId: Id<"poolTables">
  poolTableName: string
  startTime: number
  poolRentalId?: Id<"poolRentals">
  packetRate?: Rate
  packetCost?: number
}) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.stopTimer),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been stopped.`,
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    mutate({
      stopTimerSchema: {
        poolTableId,
        poolRentalId: poolRentalId!,
        startTime: startTime,
        endTime: Date.now(),
        cost: packetCost!,
        rate: packetRate!,
      },
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
            Click Stop Timer when you&apos;re done.
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
                <Loader2 className="size-4 animate-spin" />
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
