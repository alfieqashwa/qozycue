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
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { toast } from "sonner"

type DeletePacketProps = {
  id: Id<"packets">
  name: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function DeletePacket({ id, name, open, setOpen }: DeletePacketProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.packets.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Packet ${name.toUpperCase()} has been deleted.`,
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
    mutate({ deletePacketSchema: { id } })
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
            <DialogDescription>
              You can&apos;t undo this changes. Click Delete Packet when
              you&apos;re sure to delete Product
              <span className="px-1.5 font-medium uppercase text-primary">
                {name}.
              </span>
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
