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
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
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
    onSuccess() {
      toast.success("Succeed!", {
        description: "Your Team has been resetted.",
      })
    },
    onError(err) {
      toast.error("Something went wrong!", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
    },
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
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          size="sm"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Reset
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click Reset Session when
                you&apos;re sure to reset
                <span className="px-1.5 font-medium text-primary">{email}</span>
                session from your Team.
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
                Reset Session
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
