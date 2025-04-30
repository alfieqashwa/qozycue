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
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, RefreshCcwDot } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type RolebackOrderProps = {
  id: Id<"orders">
}

export function RollbackOrder({ id }: RolebackOrderProps) {
  const [open, setOpen] = useState(false)

  const { data: me, status } = useTanstackQuery(convexQuery(api.users.me, {}))

  /*
    Manager & Cashier can rollback the archive-order's back into the transaction list,
    but only Manager can delete them.
  */
  const managerAndCashierAccessLevel = [
    "ZENITH",
    "ADMIN",
    "MANAGER",
    "CASHIER",
  ].includes(me?.role ?? "")

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.updateStatusPaymentTo),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: `Order ${id.slice(-8)} has been successfully rolled back.`,
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

    mutate({ orderId: id, updateTo: "PAID" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={status === "success" && !managerAndCashierAccessLevel}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex w-full items-center bg-amber-600 hover:bg-amber-700 disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <RefreshCcwDot className="size-4" />
        <span>Rollback</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Are You Sure?</DialogTitle>
            <DialogDescription className="text-center">
              You can&apos;t undo this. Click Rollback to rollback the Order ID
              <span className="text-primary px-1.5 font-medium uppercase">
                {id.slice(-10, id.length)}
              </span>
              into Transactions Table.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            {isPending ? (
              <Button disabled variant="destructive">
                <Loader2 className="size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                variant={"secondary"}
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <RefreshCcwDot className="size-4" />
                Rollback
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
