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
import { Loader2, RefreshCcwDot } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
interface RollbackOrderListProps<TData> {
  table: Table<TData>
  disabledBasedOnAccessLevel: boolean
}
export function RollbackOrderList<TData>({
  table,
  disabledBasedOnAccessLevel,
}: RollbackOrderListProps<TData>) {
  const [open, setOpen] = useState(false)

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original) as FunctionReturnType<
    typeof api.orders.findAllArchiveOrderSortedByDate
  >
  const selectedOrders = selectedRows.map((row) => ({ id: row._id }))

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.updateSelectedOrders),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "All selected order(s) have been rolled back.",
      }),
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
    mutate({ selectedOrders, updateTo: "PAID" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="ml-2 h-8 whitespace-nowrap bg-amber-600 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <RefreshCcwDot className="mr-2 h-4 w-4" />
          Rollback Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Rollback All
                untuk mengembalikan order yang dipilih ke Table Transactions.
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
                type="submit"
                variant="destructive"
                size="sm"
                className="bg-amber-600"
              >
                Rollback All
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
