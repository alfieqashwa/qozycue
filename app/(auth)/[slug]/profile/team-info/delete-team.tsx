import { Loader2 } from "lucide-react"
import { useState } from "react"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { env } from "@/env"
import { api } from "@/trpc/react"

type Props = {
  id: string
  email: string | null
}

export function DeleteTeam({ id, email }: Props) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { data: profile, status } = api.user.me.useQuery()
  const { mutate, isPending } = api.user.delete.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your Team has been deleted.",
      })
      await utils.user.findAllByCompanyId.invalidate()
      /* auto-closed after succeed submit the dialog form */
      setOpen(false)
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
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
    (status === "success" && profile?.id === id) ||
    email === env.NEXT_PUBLIC_DEWA
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
                You can&apos;t undo this changes. Click Delete Team when
                you&apos;re sure to delete
                <span className="px-1.5 font-medium text-primary">{email}</span>
                from your Team.
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
                Delete Team
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
