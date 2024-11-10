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
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { type Table } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DeletePacketListProps<TData> {
  table: Table<TData>
  disabledBasedOnAccessLevel: boolean
}
export function DeletePacketList<TData>({
  table,
  disabledBasedOnAccessLevel,
}: DeletePacketListProps<TData>) {
  const [open, setOpen] = useState(false)

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original) as FunctionReturnType<
    typeof api.packets.findAll
  >

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.packets.removeSelected),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "All selected packet(s) have been deleted.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => {
      table.resetRowSelection() // reset row selection after succeed
      setOpen(false)
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({ ids: selectedRows.map((packet) => packet._id) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete All</b> when to
              delete the selected packet(s).
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
              <Button type="submit" variant="destructive" size="sm">
                Delete All
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
