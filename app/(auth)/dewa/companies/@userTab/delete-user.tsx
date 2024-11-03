import { Button } from "@/components/ui/button"
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
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  id: Id<"users">
  email: string | undefined
}

export function DeleteUser({ id, email }: Props) {
  const [open, setOpen] = useState(false)

  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.remove),
    async onSuccess() {
      toast.success("Succeed!", {
        description: "User has been deleted.",
      })
    },
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      /* auto-closed the dialog form whether submit has been succeeded or an error occured  */
      setOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({
      id,
    })
  }

  // avoid user (admin) to delete his / her own account
  const disabled =
    (status === "success" && profile?._id === id) ||
    email === process.env.DEWA_EMAIL
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="destructive"
          size="sm"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click Delete User when
                you&apos;re sure to delete
                <span className="px-1.5 font-medium text-primary">{email}</span>
                user.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={disabled || isPending}
                type="submit"
                variant="destructive"
                size="sm"
              >
                Delete User
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
