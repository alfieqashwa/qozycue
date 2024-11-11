import { FileArchive, Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils"

type ArchiveOrderProps = {
  id: string
  statusPayment: StatusPayment
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ArchiveOrder({
  id,
  statusPayment,
  setOpen,
}: ArchiveOrderProps) {
  const { mutate, isPending } = api.order.archive.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: `Order ${id} has been successfully archived.`,
      })
      // await utils.order.findAllByCompanyId.invalidate()

      /* auto-closed after succeed submit the dialog form */
      await utils.order.invalidate()
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
      <DialogTrigger
        disabled={statusPayment !== StatusPayment.PAID}
        className="flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        <FileArchive className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Archive</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Archive untuk
                mengarsipkan Order ID
                <span className="px-1.5 font-medium uppercase text-primary">
                  {id.slice(-10, id.length)}
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-row items-center justify-end space-x-2">
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
                <FileArchive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
