"use client"

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
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const DeleteTax = ({
  id,
  name,
  isDefaultValue,
}: {
  id: Id<"taxes">
  name: string
  isDefaultValue: boolean
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.taxes.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `The tax has been deleted.`,
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
        disabled={isDefaultValue}
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
              you&apos;re sure to delete{" "}
              <span className="text-primary">{name}</span>.
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
