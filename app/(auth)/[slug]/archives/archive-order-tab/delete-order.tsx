import { Loader2, Trash2 } from "lucide-react"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { wait } from "@/lib/wait"
import { api } from "@/trpc/react"

type DeleteOrderProps = {
  id: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteOrder({ id, setOpen }: DeleteOrderProps) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.order.delete.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            Order{" "}
            <span className="text-primary">{id.slice(-8, id.length)}</span> has
            been successfully deleted.
          </p>
        ),
      })
      await utils.order.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
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
        <Trash2 className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Delete untuk
                menghapus Order ID
                <span className="px-1.5 font-medium uppercase text-primary">
                  {id.slice(-10, id.length)}.
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Cancel
            </DialogClose>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
