import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
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
import { Status } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Trash } from "lucide-react"
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

  const poolRental = useTanstackQuery({
    ...convexQuery(api.poolRentals.findByPoolTableId, { poolTableId: id }),
    enabled: Boolean(id),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.remove),
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

  const hasSoldPoolRental =
    poolRental.status === "success" && Boolean(poolRental.data?._id)

  const disabled = isActive || status === "enabled" || hasSoldPoolRental

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash />
        <span>Delete</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete</b> when
              you&apos;re sure to delete Table{" "}
              <span className="text-primary px-1.5 font-medium uppercase">
                {name}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            <SubmitButton
              title="Delete"
              isPending={isPending}
              variant="destructive"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
