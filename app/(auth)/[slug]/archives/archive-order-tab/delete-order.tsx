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
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type DeleteOrderProps = {
  id: Id<"orders">
}
export function DeleteOrder({ id }: DeleteOrderProps) {
  const [open, setOpen] = useState(false)

  const { data: me, status } = useTanstackQuery(convexQuery(api.users.me, {}))

  // Only Manager can delete them.
  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    me?.role ?? "",
  )
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.remove),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: (
          <p>
            Order{" "}
            <span className="text-primary">{id.slice(-8, id.length)}</span> has
            been successfully deleted.
          </p>
        ),
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
    mutate({ id })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={status === "success" && !managerAccessLevel}
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash2 className="text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this change. Click <b>Delete</b> to remove
              Order ID
              <span className="text-primary px-1.5 font-medium uppercase">
                {id.slice(-10, id.length)}.
              </span>
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
                <Loader2 className="size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
