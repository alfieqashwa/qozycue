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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FileArchive, Loader2 } from "lucide-react"
import { toast } from "sonner"

type ArchiveOrderProps = {
  id: Id<"orders">
  statusPayment: StatusPayment
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ArchiveOrder({
  id,
  statusPayment,
  setOpen,
}: ArchiveOrderProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.archive),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Order ${id} has been successfully archived.`,
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
    <Dialog>
      <DialogTrigger
        disabled={statusPayment !== "PAID"}
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
