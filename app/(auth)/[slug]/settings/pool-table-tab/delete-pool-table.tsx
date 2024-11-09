import { Button, buttonVariants } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const DeletePoolTable = ({
  isActive,
  id,
  name,
  status,
}: {
  isActive: boolean
  id: Id<"poolTables">
  name: string
  status: Status
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.pooltables.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The pool table has been deleted.",
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
        disabled={isActive || status === "enabled"}
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash size={16} className="mr-1" />
        <span>Delete</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete UoM</b> when
              you&apos;re sure to delete Table{" "}
              <span className="px-1.5 font-medium uppercase text-primary">
                {name}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(!open)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled variant="destructive">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={isActive || status === "enabled"}
                type="submit"
                variant="destructive"
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
