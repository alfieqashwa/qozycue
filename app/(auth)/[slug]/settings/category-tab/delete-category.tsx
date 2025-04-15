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
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const DeleteCategory = ({
  id,
  name,
}: {
  id: Id<"categories">
  name: string
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.categories.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The category has been deleted.",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex items-center",
        )}
      >
        <Trash size={16} />
        <span>Delete</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete</b> when
              you&apos;re sure to delete{" "}
              <span className="text-primary px-1.5 font-medium uppercase">
                {name}.
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
              <Button disabled variant="destructive">
                <Loader2 className="size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
