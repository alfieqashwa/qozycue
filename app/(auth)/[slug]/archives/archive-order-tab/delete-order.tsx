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
import { toast } from "sonner"

type DeleteOrderProps = {
  id: Id<"orders">
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function DeleteOrder({ id, setOpen }: DeleteOrderProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            Order{" "}
            <span className="text-primary">{id.slice(-8, id.length)}</span> has
            been successfully deleted.
          </p>
        ),
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
    mutate({ id })
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center">
        <Trash2 className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this change. Click <b>Delete</b> to remove
              Order ID
              <span className="px-1.5 font-medium uppercase text-primary">
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
