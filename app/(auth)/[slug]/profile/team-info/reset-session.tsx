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
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ResetSession({
  userId,
  email,
}: {
  userId: Id<"users">
  email: string | undefined
}) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.sessions.deleteAllByUserId),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: "Your Team has been resetted.",
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
    mutate({
      userId,
    })
  }

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const disabled =
    email === process.env.NEXT_PUBLIC_SUPER_ADMIN || email === me.data?.email
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <RefreshCw />
        <span className="whitespace-nowrap">Reset</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Reset Session</b> when
              you&apos;re sure to reset
              <span className="text-primary px-1.5 font-medium">{email}</span>
              session from your Team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose>Cancel</DialogClose>
            <SubmitButton
              title="Reset Session"
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
