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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function RemoveOrder({
  isCashier,
  orderId,
  customerName,
}: {
  isCashier: boolean
  orderId: Id<"orders">
  customerName: string
}) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.removeCafeOnly),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `${customerName} has been successfully removed.`,
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({ id: orderId })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!isCashier}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Remove</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click Remove when you&apos;re
              sure to remove
              <span className="px-1.5 font-medium uppercase text-primary">
                {customerName}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-4">
            <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
              Cancel
            </DialogClose>
            {isPending ? (
              <Button
                disabled
                variant="destructive"
                size="sm"
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
