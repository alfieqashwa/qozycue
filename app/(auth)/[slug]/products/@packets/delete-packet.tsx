import { Button, buttonVariants } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { DialogClose } from "@radix-ui/react-dialog"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type DeletePacketProps = {
  id: Id<"packets">
  name: string
  status: Status
}
export function DeletePacket({ id, name, status }: DeletePacketProps) {
  const [open, setOpen] = useState(false)

  const [me, poolRental] = useTanstackQueries({
    queries: [
      convexQuery(api.users.me, {}),
      {
        ...convexQuery(api.poolRentals.findByPacketId, { packetId: id }),
        enabled: Boolean(id),
      },
    ],
  })

  const adminAccessLevel =
    me.status === "success" &&
    (me.data?.role === "ZENITH" || me.data?.role === "ADMIN")

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={
          status === "enabled" ||
          !adminAccessLevel ||
          (poolRental.status === "success" && Boolean(poolRental.data?._id)) // disabled delete button if its packet has already been use.
        }
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash className="size-4" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click Delete Packet when
              you&apos;re sure to delete Product
              <span className="text-primary px-1.5 font-medium uppercase">
                {name}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              variant="destructive"
              className="whitespace-nowrap"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Please wait</span>
                </>
              ) : (
                <span>Delete Packet</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
