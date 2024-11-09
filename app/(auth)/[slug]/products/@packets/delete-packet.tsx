import { Loader2, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { api } from "@/trpc/react"

type DeletePacketProps = {
  id: string
  name: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeletePacket({ id, name, open, setOpen }: DeletePacketProps) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.packet.delete.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: `Packet ${name.toUpperCase()} has been deleted.`,
      })
      await utils.company.subscriptions.invalidate()
      router.refresh()
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

    mutate({ id })
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center">
        <Trash className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Delete Packet
                untuk menghapus Paket
                <span className="px-1.5 font-medium uppercase text-primary">
                  {name}.
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(!open)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive" size="sm">
                Delete Packet
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
