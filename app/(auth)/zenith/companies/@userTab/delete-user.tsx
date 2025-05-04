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
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function DeleteUser({
  id,
  email,
}: {
  id: Id<"users">
  email: string | undefined
}) {
  const [open, setOpen] = useState(false)

  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "User has been deleted.",
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

  // avoid user (admin) to delete his / her own account
  const disabled =
    (status === "success" && profile?._id === id) ||
    email === process.env.NEXT_PUBLIC_SUPER_ADMIN
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash2 />
        Delete
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete User</b> when
              you&apos;re sure to delete
              <span className="text-primary px-1.5 font-medium">{email}</span>
              user.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            <SubmitButton
              title="Delete User"
              isPending={isPending}
              disabled={disabled || isPending}
              variant="destructive"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
