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
import { StatusPayment } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FileArchive, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type ArchiveOrderProps = {
  orderId: Id<"orders">
  statusPayment: StatusPayment
}

export function ArchiveOrder({ orderId, statusPayment }: ArchiveOrderProps) {
  const [open, setOpen] = useState(false)

  const { data: me, status } = useTanstackQuery({
    ...convexQuery(api.users.me, {}),
  })
  const managerAndCashierAccessLevel =
    me?.role === "MANAGER" ||
    me?.role === "CASHIER" ||
    me?.role === "ADMIN" ||
    me?.role === "DEWA"

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.updateStatusPaymentTo),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: `Order ${orderId.slice(-8)} has been successfully archived.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({ orderId, updateTo: "ARCHIVE" })
  }
  const disabled =
    statusPayment !== "PAID" ||
    (status === "success" && !managerAndCashierAccessLevel)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground",
        )}
      >
        <FileArchive className="mr-2 h-4 w-4" />
        <span>Remove</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this change. Click Remove to remove Order ID
              <span className="px-1.5 font-medium uppercase text-primary">
                {orderId.slice(-10, orderId.length)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-row items-center justify-end space-x-2">
            <DialogClose
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Cancel
            </DialogClose>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                Remove
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
