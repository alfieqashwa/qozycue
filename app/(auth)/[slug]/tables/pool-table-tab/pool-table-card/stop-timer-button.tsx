import { SubmitButton } from "@/components/submit-button"
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
import { TimerOff } from "lucide-react"
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
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been stopped.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
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
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <TimerOff className="text-primary disabled:text-primary/10 size-5" />
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
            <SubmitButton isPending={isPending} title="Stop Timer" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
