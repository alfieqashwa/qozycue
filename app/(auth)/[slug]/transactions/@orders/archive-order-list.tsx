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
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { type Table } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { FileArchive, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ArchiveOrderListProps<TData> {
  table: Table<TData>
}
export function ArchiveOrderList<TData>({
  table,
}: ArchiveOrderListProps<TData>) {
  const [open, setOpen] = useState(false)

  const { data: me, status } = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel = ["ZENITH", "ADMIN", "MANAGER"].includes(
    me?.role ?? "",
  )

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original) as FunctionReturnType<
    typeof api.orders.findAllSortedByDate
  >
  const selectedOrders = selectedRows.map((row) => ({ id: row._id }))
  /*
    Disabled Archive Selected Button if there's order
    where has Status Payment to not equal to "PAID".
    Which means, only PAID order can be sent to Archives Page.
  */
  const disabled =
    selectedRows.some((row) => row.statusPayment !== "PAID") ||
    (status === "success" && !managerAccessLevel)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.updateSelectedOrders),
    async onSuccess() {
      toast.success("Succeed!", {
        description: "All selected order(s) have been archived.",
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => {
      table.resetRowSelection() // reset row selection whether succeed or error occured
      setOpen(false)
    },
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({
      selectedOrders,
      updateTo: "ARCHIVE",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FileArchive />
          Archive Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this. Click <b>Archive All</b> to archive the
              selected order(s).
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
                <Loader2 className="size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive" size="sm">
                Archive All
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/*
cls7enxw100041406mjtdr632
PENDING

cls7cem350002xy5fd50tuh67
PENDING

cls70iyp7000i4rsw36hoj27w
 PAID
 */
