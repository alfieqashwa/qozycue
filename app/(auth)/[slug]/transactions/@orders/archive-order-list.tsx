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
import { type Table } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { FileArchive, Loader2 } from "lucide-react"
import { useState } from "react"

interface ArchiveOrderListProps<TData> {
  table: Table<TData>
}

export function ArchiveOrderList<TData>({
  table,
}: ArchiveOrderListProps<TData>) {
  const [open, setOpen] = useState(false)

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original) as FunctionReturnType<
    typeof api.orders.findAllSortedByDate
  >

  const ids = selectedRows.map((row) => ({
    id: row._id,
  }))

  /*
    Disabled Archive Selected Button if there's order
    where has Status Payment to not equal to "PAID".
    Which means, only PAID order can be sent to Archives Page.
  */
  const disabled = selectedRows.some((row) => row.statusPayment !== "PAID")
  // || disabledBasedOnAccessLevel

  // const { mutate, isPending } = api.order.archiveSelected.useMutation({
  //   async onSuccess() {
  //     toast({
  //       title: "Succeed!",
  //       variant: "default",
  //       description: "All selected order(s) have been archived.",
  //     })
  //     table.resetRowSelection() // reset row selection after succeed
  //     /* auto-closed after succeed submit the dialog form */
  //     setOpen(false)
  //   },
  //   onError(err) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: err.message || "There was a problem with your request.",
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     })
  //   },
  // })

  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   mutate({ ids })
  // }

  const isPending = false // temporary var
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FileArchive className="mr-2 h-4 w-4" />
          Archive Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={() => console.log(`submitted`)}>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
