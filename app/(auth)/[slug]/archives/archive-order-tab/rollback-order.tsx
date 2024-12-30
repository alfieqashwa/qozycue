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
    "DEWA",
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
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex w-full items-center bg-amber-600 hover:bg-amber-700 disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <RefreshCcwDot className="mr-2 h-4 w-4" />
        <span>Rollback</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Rollback untuk
                mengembalikan Order ID
                <span className="px-1.5 font-medium uppercase text-primary">
                  {id.slice(-10, id.length)}
                </span>
                ke Table Transactions.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
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
              <Button
                variant={"secondary"}
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <RefreshCcwDot className="mr-2 h-4 w-4" />
                Rollback
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
