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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, TimerReset } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ResetButton({
  poolTableId,
  poolTableName,
  orderId,
  disabled,
}: {
  poolTableId: Id<"poolTables">
  poolTableName: string
  orderId: Id<"orders"> | undefined
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)

  const resetTimer = useMutation({
    mutationFn: useConvexMutation(api.orders.resetTimer),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been reset.`,
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled}>
        <TooltipReset disabled={disabled}>
          <TimerReset
            aria-disabled={disabled}
            size={32}
            className={cn(
              "relative mt-2 cursor-pointer",
              disabled &&
                "text-muted-foreground aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed",
            )}
          />
        </TooltipReset>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure want to reset the timer?</DialogTitle>
          <DialogDescription>
            Click Reset Timer when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-12">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            className="mt-1.5 sm:mt-0"
          >
            Cancel
          </Button>
          {resetTimer.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={resetTimer.isPending || disabled}
              type="submit"
              onClick={() =>
                resetTimer.mutate({ poolTableId, orderId: orderId! })
              }
              className="disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              Reset Timer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const TooltipReset = ({
  disabled,
  children,
}: {
  disabled: boolean
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent className={cn("bg-muted", disabled && "sr-only")}>
      <p className="font-sans text-sm capitalize text-muted-foreground">
        Reset Table
      </p>
    </TooltipContent>
  </Tooltip>
)
